package com.grievora.service;

import com.grievora.dto.*;
import com.grievora.entity.*;
import com.grievora.exception.BadRequestException;
import com.grievora.exception.ResourceNotFoundException;
import com.grievora.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintStatusHistoryRepository historyRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public AdminService(ComplaintRepository complaintRepository,
                        ComplaintStatusHistoryRepository historyRepository,
                        DepartmentRepository departmentRepository,
                        UserRepository userRepository,
                        NotificationService notificationService) {
        this.complaintRepository = complaintRepository;
        this.historyRepository = historyRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public AdminDashboardDto getDashboardOverview() {
        AdminDashboardDto dto = new AdminDashboardDto();

        long total = complaintRepository.count();
        long submitted = complaintRepository.countByStatus(ComplaintStatus.SUBMITTED);
        long underReview = complaintRepository.countByStatus(ComplaintStatus.UNDER_REVIEW);
        long inProgress = complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS);
        long resolved = complaintRepository.countByStatus(ComplaintStatus.RESOLVED);
        long rejected = complaintRepository.countByStatus(ComplaintStatus.REJECTED);
        long urgentOpen = complaintRepository.countUrgentOpenComplaints();

        dto.setTotalComplaints(total);
        dto.setNewComplaints(submitted);
        dto.setUnderReviewComplaints(underReview);
        dto.setInProgressComplaints(inProgress);
        dto.setResolvedComplaints(resolved);
        dto.setRejectedComplaints(rejected);
        dto.setUrgentOpenComplaints(urgentOpen);

        // Resolution Rate: resolved / (total - rejected) or resolved / total if total > 0
        double resolutionRate = (total > 0) ? ((double) resolved / total) * 100.0 : 0.0;
        dto.setResolutionRatePercentage(Math.round(resolutionRate * 10.0) / 10.0);

        // Calculate actual average resolution time from database resolved complaints
        List<Complaint> resolvedList = complaintRepository.findAllResolved();
        if (!resolvedList.isEmpty()) {
            double totalHours = 0;
            int count = 0;
            for (Complaint c : resolvedList) {
                if (c.getResolvedAt() != null && c.getSubmittedAt() != null) {
                    long minutes = Duration.between(c.getSubmittedAt(), c.getResolvedAt()).toMinutes();
                    totalHours += (double) minutes / 60.0;
                    count++;
                }
            }
            double avgHours = count > 0 ? (totalHours / count) : 0;
            dto.setAverageResolutionTimeHours(Math.round(avgHours * 10.0) / 10.0);
        } else {
            dto.setAverageResolutionTimeHours(0.0);
        }

        // Category breakdown
        Map<String, Long> catMap = new LinkedHashMap<>();
        for (Object[] row : complaintRepository.countComplaintsByCategory()) {
            catMap.put((String) row[0], (Long) row[1]);
        }
        dto.setComplaintsByCategory(catMap);

        // Status breakdown
        Map<String, Long> statusMap = new LinkedHashMap<>();
        for (Object[] row : complaintRepository.countComplaintsByStatus()) {
            statusMap.put(((ComplaintStatus) row[0]).name(), (Long) row[1]);
        }
        dto.setComplaintsByStatus(statusMap);

        // Priority breakdown
        Map<String, Long> priorityMap = new LinkedHashMap<>();
        for (Object[] row : complaintRepository.countComplaintsByPriority()) {
            priorityMap.put(((ComplaintPriority) row[0]).name(), (Long) row[1]);
        }
        dto.setComplaintsByPriority(priorityMap);

        // Department breakdown
        Map<String, Long> deptMap = new LinkedHashMap<>();
        for (Object[] row : complaintRepository.countComplaintsByDepartment()) {
            deptMap.put((String) row[0], (Long) row[1]);
        }
        dto.setComplaintsByDepartment(deptMap);

        // Recent 5 complaints
        Page<Complaint> recent = complaintRepository.findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "submittedAt")));
        dto.setRecentComplaints(recent.getContent().stream().map(ComplaintResponse::fromEntity).collect(Collectors.toList()));

        return dto;
    }

    @Transactional
    public ComplaintResponse updateStatus(Long complaintId, ComplaintStatusUpdateRequest request, Long adminId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        ComplaintStatus current = complaint.getStatus();
        ComplaintStatus target = request.getNewStatus();

        if (!current.canTransitionTo(target)) {
            throw new BadRequestException("Invalid status transition from " + current + " to " + target);
        }

        complaint.setStatus(target);
        complaint.setUpdatedAt(LocalDateTime.now());

        if (target == ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }

        complaint = complaintRepository.save(complaint);

        // Record history
        ComplaintStatusHistory history = new ComplaintStatusHistory(
                complaint,
                current,
                target,
                admin,
                request.getUpdateMessage()
        );
        historyRepository.save(history);

        // Notify user
        notificationService.createNotification(
                complaint.getSubmittedBy(),
                complaint,
                "Status Updated: " + complaint.getComplaintReference(),
                "Status changed to " + target + ": " + request.getUpdateMessage()
        );

        return ComplaintResponse.fromEntity(complaint);
    }

    @Transactional
    public ComplaintResponse updatePriority(Long complaintId, PriorityUpdateRequest request, Long adminId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        ComplaintPriority oldPriority = complaint.getPriority();
        complaint.setPriority(request.getPriority());
        complaint.setUpdatedAt(LocalDateTime.now());
        complaint = complaintRepository.save(complaint);

        String msg = "Priority updated from " + oldPriority + " to " + request.getPriority() +
                (request.getReason() != null ? ". Reason: " + request.getReason() : "");

        historyRepository.save(new ComplaintStatusHistory(complaint, complaint.getStatus(), complaint.getStatus(), admin, msg));

        notificationService.createNotification(
                complaint.getSubmittedBy(),
                complaint,
                "Priority Adjusted: " + complaint.getComplaintReference(),
                "Priority level adjusted to " + request.getPriority()
        );

        return ComplaintResponse.fromEntity(complaint);
    }

    @Transactional
    public ComplaintResponse updateAssignment(Long complaintId, AssignmentUpdateRequest request, Long adminId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            complaint.setAssignedDepartment(department);
        }

        User staff = null;
        if (request.getStaffUserId() != null) {
            staff = userRepository.findById(request.getStaffUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Staff user not found"));
            complaint.setAssignedTo(staff);
        }

        ComplaintStatus prev = complaint.getStatus();
        if (complaint.getStatus() == ComplaintStatus.SUBMITTED || complaint.getStatus() == ComplaintStatus.UNDER_REVIEW) {
            complaint.setStatus(ComplaintStatus.ASSIGNED);
        }

        complaint.setUpdatedAt(LocalDateTime.now());
        complaint = complaintRepository.save(complaint);

        String message = "Assigned to " + (department != null ? department.getName() : "department") +
                (staff != null ? " (Lead: " + staff.getFullName() + ")" : "") +
                (request.getAssignmentNote() != null ? ". Note: " + request.getAssignmentNote() : "");

        historyRepository.save(new ComplaintStatusHistory(complaint, prev, complaint.getStatus(), admin, message));

        notificationService.createNotification(
                complaint.getSubmittedBy(),
                complaint,
                "Complaint Assigned: " + complaint.getComplaintReference(),
                message
        );

        return ComplaintResponse.fromEntity(complaint);
    }

    @Transactional
    public ComplaintResponse resolveComplaint(Long complaintId, ResolutionRequest request, Long adminId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        ComplaintStatus prev = complaint.getStatus();
        complaint.setStatus(ComplaintStatus.RESOLVED);
        complaint.setResolutionNotes(request.getResolutionNotes().trim());
        complaint.setResolvedAt(LocalDateTime.now());
        complaint.setUpdatedAt(LocalDateTime.now());

        complaint = complaintRepository.save(complaint);

        String msg = "Complaint marked as Resolved. Resolution details: " + request.getResolutionNotes().trim();
        historyRepository.save(new ComplaintStatusHistory(complaint, prev, ComplaintStatus.RESOLVED, admin, msg));

        notificationService.createNotification(
                complaint.getSubmittedBy(),
                complaint,
                "Resolved: " + complaint.getComplaintReference(),
                "Your issue has been resolved. Note: " + request.getResolutionNotes()
        );

        return ComplaintResponse.fromEntity(complaint);
    }

    @Transactional
    public ComplaintResponse rejectComplaint(Long complaintId, RejectionRequest request, Long adminId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        ComplaintStatus prev = complaint.getStatus();
        complaint.setStatus(ComplaintStatus.REJECTED);
        complaint.setRejectionReason(request.getRejectionReason().trim());
        complaint.setUpdatedAt(LocalDateTime.now());

        complaint = complaintRepository.save(complaint);

        String msg = "Complaint rejected by administration. Reason: " + request.getRejectionReason().trim();
        historyRepository.save(new ComplaintStatusHistory(complaint, prev, ComplaintStatus.REJECTED, admin, msg));

        notificationService.createNotification(
                complaint.getSubmittedBy(),
                complaint,
                "Complaint Rejected: " + complaint.getComplaintReference(),
                "Your complaint could not be processed. Reason: " + request.getRejectionReason()
        );

        return ComplaintResponse.fromEntity(complaint);
    }

    @Transactional(readOnly = true)
    public Page<ComplaintResponse> searchAndFilterComplaints(String query,
                                                             ComplaintStatus status,
                                                             ComplaintPriority priority,
                                                             String category,
                                                             Long departmentId,
                                                             Pageable pageable) {
        Specification<Complaint> spec = (root, q, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            if (query != null && !query.trim().isEmpty()) {
                String search = "%" + query.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), search),
                        cb.like(cb.lower(root.get("complaintReference")), search),
                        cb.like(cb.lower(root.get("location")), search),
                        cb.like(cb.lower(root.get("building")), search)
                ));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (priority != null) {
                predicates.add(cb.equal(root.get("priority"), priority));
            }

            if (category != null && !category.trim().isEmpty()) {
                predicates.add(cb.equal(root.get("category"), category.trim()));
            }

            if (departmentId != null) {
                predicates.add(cb.equal(root.get("assignedDepartment").get("id"), departmentId));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        return complaintRepository.findAll(spec, pageable).map(ComplaintResponse::fromEntity);
    }
}
