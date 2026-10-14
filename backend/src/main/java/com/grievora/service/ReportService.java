package com.grievora.service;

import com.grievora.dto.ComplaintResponse;
import com.grievora.dto.ReportDto;
import com.grievora.entity.Complaint;
import com.grievora.entity.ComplaintPriority;
import com.grievora.entity.ComplaintStatus;
import com.grievora.repository.ComplaintRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ComplaintRepository complaintRepository;

    public ReportService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    @Transactional(readOnly = true)
    public ReportDto generateAnalyticsReport() {
        ReportDto report = new ReportDto();

        long total = complaintRepository.count();
        long resolved = complaintRepository.countByStatus(ComplaintStatus.RESOLVED);
        long rejected = complaintRepository.countByStatus(ComplaintStatus.REJECTED);
        long open = total - resolved - rejected;

        report.setTotalReceived(total);
        report.setTotalResolved(resolved);
        report.setTotalOpen(open);
        report.setTotalRejected(rejected);

        // Resolution Rate: resolved / total
        double rate = total > 0 ? ((double) resolved / total) * 100.0 : 0.0;
        report.setResolutionRatePercentage(Math.round(rate * 10.0) / 10.0);

        // Average Resolution Time
        List<Complaint> resolvedComplaints = complaintRepository.findAllResolved();
        if (!resolvedComplaints.isEmpty()) {
            double totalHours = 0;
            int count = 0;
            for (Complaint c : resolvedComplaints) {
                if (c.getResolvedAt() != null && c.getSubmittedAt() != null) {
                    long minutes = Duration.between(c.getSubmittedAt(), c.getResolvedAt()).toMinutes();
                    totalHours += (double) minutes / 60.0;
                    count++;
                }
            }
            double avgHours = count > 0 ? (totalHours / count) : 0.0;
            report.setAverageResolutionTimeHours(Math.round(avgHours * 10.0) / 10.0);
            report.setAverageResolutionTimeDays(Math.round((avgHours / 24.0) * 10.0) / 10.0);
        } else {
            report.setAverageResolutionTimeHours(0.0);
            report.setAverageResolutionTimeDays(0.0);
        }

        // Category frequency
        Map<String, Long> catFreq = new LinkedHashMap<>();
        for (Object[] row : complaintRepository.countComplaintsByCategory()) {
            catFreq.put((String) row[0], (Long) row[1]);
        }
        report.setCategoryFrequency(catFreq);

        // Priority distribution
        Map<String, Long> priorityDist = new LinkedHashMap<>();
        for (Object[] row : complaintRepository.countComplaintsByPriority()) {
            priorityDist.put(((ComplaintPriority) row[0]).name(), (Long) row[1]);
        }
        report.setPriorityDistribution(priorityDist);

        // Department workload
        Map<String, Long> deptWorkload = new LinkedHashMap<>();
        for (Object[] row : complaintRepository.countComplaintsByDepartment()) {
            deptWorkload.put((String) row[0], (Long) row[1]);
        }
        report.setDepartmentWorkload(deptWorkload);

        // Recurring hotspot buildings & categories
        List<Complaint> all = complaintRepository.findAll();
        Map<String, Long> hotspotCounts = all.stream()
                .collect(Collectors.groupingBy(c -> c.getBuilding() + " — " + c.getCategory(), Collectors.counting()));

        List<Map<String, Object>> hotspots = hotspotCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    String[] parts = entry.getKey().split(" — ");
                    map.put("building", parts[0]);
                    map.put("category", parts.length > 1 ? parts[1] : "");
                    map.put("count", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
        report.setRecurringIssueHotspots(hotspots);

        // Long pending complaints (open > 3 days)
        LocalDateTime threeDaysAgo = LocalDateTime.now().minusDays(3);
        List<Complaint> longPending = complaintRepository.findLongPendingComplaints(threeDaysAgo, PageRequest.of(0, 10));
        report.setLongPendingComplaints(longPending.stream().map(ComplaintResponse::fromEntity).collect(Collectors.toList()));

        return report;
    }

    @Transactional(readOnly = true)
    public String generateComplaintsCsv() {
        List<Complaint> list = complaintRepository.findAll();
        StringBuilder sb = new StringBuilder();
        sb.append("Reference,Title,Category,Building,Location,Priority,Status,SubmittedBy,AssignedDept,SubmittedAt,ResolvedAt\n");

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (Complaint c : list) {
            sb.append("\"").append(escapeCsv(c.getComplaintReference())).append("\",")
              .append("\"").append(escapeCsv(c.getTitle())).append("\",")
              .append("\"").append(escapeCsv(c.getCategory())).append("\",")
              .append("\"").append(escapeCsv(c.getBuilding())).append("\",")
              .append("\"").append(escapeCsv(c.getLocation())).append("\",")
              .append("\"").append(c.getPriority().name()).append("\",")
              .append("\"").append(c.getStatus().name()).append("\",")
              .append("\"").append(c.getSubmittedBy() != null ? escapeCsv(c.getSubmittedBy().getFullName()) : "").append("\",")
              .append("\"").append(c.getAssignedDepartment() != null ? escapeCsv(c.getAssignedDepartment().getName()) : "Unassigned").append("\",")
              .append("\"").append(c.getSubmittedAt() != null ? c.getSubmittedAt().format(dtf) : "").append("\",")
              .append("\"").append(c.getResolvedAt() != null ? c.getResolvedAt().format(dtf) : "").append("\"\n");
        }

        return sb.toString();
    }

    private String escapeCsv(String str) {
        if (str == null) return "";
        return str.replace("\"", "\"\"");
    }
}
