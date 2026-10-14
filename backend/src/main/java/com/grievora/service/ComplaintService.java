package com.grievora.service;

import com.grievora.dto.*;
import com.grievora.entity.*;
import com.grievora.exception.BadRequestException;
import com.grievora.exception.ResourceNotFoundException;
import com.grievora.exception.UnauthorizedException;
import com.grievora.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintStatusHistoryRepository historyRepository;
    private final ComplaintCommentRepository commentRepository;
    private final AttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ComplaintService(ComplaintRepository complaintRepository,
                            ComplaintStatusHistoryRepository historyRepository,
                            ComplaintCommentRepository commentRepository,
                            AttachmentRepository attachmentRepository,
                            UserRepository userRepository,
                            NotificationService notificationService) {
        this.complaintRepository = complaintRepository;
        this.historyRepository = historyRepository;
        this.commentRepository = commentRepository;
        this.attachmentRepository = attachmentRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ComplaintResponse createComplaint(ComplaintRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getPriority() == ComplaintPriority.URGENT && 
           (request.getUrgencyReason() == null || request.getUrgencyReason().trim().length() < 10)) {
            throw new BadRequestException("Please provide a valid explanation (minimum 10 characters) why this complaint is marked URGENT.");
        }

        long count = complaintRepository.count() + 1;
        String reference = String.format("GRV-%d-%04d", Year.now().getValue(), count);

        Complaint complaint = new Complaint();
        complaint.setComplaintReference(reference);
        complaint.setTitle(request.getTitle().trim());
        complaint.setDescription(request.getDescription().trim());
        complaint.setCategory(request.getCategory().trim());
        complaint.setLocation(request.getLocation().trim());
        complaint.setBuilding(request.getBuilding().trim());
        complaint.setFloorOrRoom(request.getFloorOrRoom() != null ? request.getFloorOrRoom().trim() : null);
        complaint.setPriority(request.getPriority());
        complaint.setUrgencyReason(request.getUrgencyReason() != null ? request.getUrgencyReason().trim() : null);
        complaint.setStatus(ComplaintStatus.SUBMITTED);
        complaint.setSubmittedBy(user);
        complaint.setSubmittedAt(LocalDateTime.now());
        complaint.setUpdatedAt(LocalDateTime.now());

        complaint = complaintRepository.save(complaint);

        // Record initial status history
        ComplaintStatusHistory initialHistory = new ComplaintStatusHistory(
                complaint,
                null,
                ComplaintStatus.SUBMITTED,
                user,
                "Complaint filed successfully and logged into Grievora system."
        );
        historyRepository.save(initialHistory);

        // Send confirmation notification to submitter
        notificationService.createNotification(
                user,
                complaint,
                "Complaint Logged: " + reference,
                "Your complaint '" + complaint.getTitle() + "' was received. Reference: " + reference
        );

        // If urgent, notify admins immediately
        if (complaint.getPriority() == ComplaintPriority.URGENT) {
            notificationService.notifyAdmins(
                    complaint,
                    "URGENT Complaint Alert: " + reference,
                    "Urgent issue submitted at " + complaint.getBuilding() + " (" + complaint.getLocation() + "): " + complaint.getTitle()
            );
        }

        return ComplaintResponse.fromEntity(complaint);
    }

    @Transactional(readOnly = true)
    public Page<ComplaintResponse> getUserComplaints(Long userId, Pageable pageable) {
        return complaintRepository.findBySubmittedById(userId, pageable)
                .map(ComplaintResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public ComplaintDetailResponse getComplaintDetails(Long complaintId, Long userId, Role userRole) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintId));

        // Ownership or Admin access check
        if (userRole != Role.ADMIN && !complaint.getSubmittedBy().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to view this complaint.");
        }

        List<StatusHistoryResponse> timeline = historyRepository.findByComplaintIdOrderByChangedAtAsc(complaintId)
                .stream()
                .map(StatusHistoryResponse::fromEntity)
                .collect(Collectors.toList());

        List<CommentResponse> comments;
        if (userRole == Role.ADMIN) {
            comments = commentRepository.findByComplaintIdOrderByCreatedAtAsc(complaintId).stream()
                    .map(CommentResponse::fromEntity)
                    .collect(Collectors.toList());
        } else {
            comments = commentRepository.findByComplaintIdAndVisibilityOrderByCreatedAtAsc(complaintId, CommentVisibility.PUBLIC).stream()
                    .map(CommentResponse::fromEntity)
                    .collect(Collectors.toList());
        }

        List<AttachmentDto> attachments = attachmentRepository.findByComplaintId(complaintId).stream()
                .map(AttachmentDto::fromEntity)
                .collect(Collectors.toList());

        return ComplaintDetailResponse.fromEntity(complaint, timeline, comments, attachments);
    }

    @Transactional
    public CommentResponse addComment(Long complaintId, CommentRequest request, Long userId, Role userRole) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        if (userRole != Role.ADMIN && !complaint.getSubmittedBy().getId().equals(userId)) {
            throw new UnauthorizedException("You cannot comment on this complaint.");
        }

        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CommentVisibility visibility = (userRole == Role.ADMIN && request.getVisibility() != null)
                ? request.getVisibility()
                : CommentVisibility.PUBLIC;

        ComplaintComment comment = new ComplaintComment(complaint, author, request.getMessage().trim(), visibility);
        comment = commentRepository.save(comment);

        // Notify user if admin commented publicly
        if (userRole == Role.ADMIN && visibility == CommentVisibility.PUBLIC) {
            notificationService.createNotification(
                    complaint.getSubmittedBy(),
                    complaint,
                    "New Admin Response on " + complaint.getComplaintReference(),
                    "Admin " + author.getFullName() + " posted an update on your complaint."
            );
        }

        return CommentResponse.fromEntity(comment);
    }
}
