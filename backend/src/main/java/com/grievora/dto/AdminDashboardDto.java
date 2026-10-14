package com.grievora.dto;

import java.util.List;
import java.util.Map;

public class AdminDashboardDto {
    private long totalComplaints;
    private long newComplaints;
    private long underReviewComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;
    private long rejectedComplaints;
    private long urgentOpenComplaints;
    private double averageResolutionTimeHours;
    private double resolutionRatePercentage;

    private Map<String, Long> complaintsByCategory;
    private Map<String, Long> complaintsByPriority;
    private Map<String, Long> complaintsByStatus;
    private Map<String, Long> complaintsByDepartment;

    private List<ComplaintResponse> recentComplaints;
    private List<ComplaintResponse> urgentOpenList;

    public AdminDashboardDto() {}

    public long getTotalComplaints() { return totalComplaints; }
    public void setTotalComplaints(long totalComplaints) { this.totalComplaints = totalComplaints; }

    public long getNewComplaints() { return newComplaints; }
    public void setNewComplaints(long newComplaints) { this.newComplaints = newComplaints; }

    public long getUnderReviewComplaints() { return underReviewComplaints; }
    public void setUnderReviewComplaints(long underReviewComplaints) { this.underReviewComplaints = underReviewComplaints; }

    public long getInProgressComplaints() { return inProgressComplaints; }
    public void setInProgressComplaints(long inProgressComplaints) { this.inProgressComplaints = inProgressComplaints; }

    public long getResolvedComplaints() { return resolvedComplaints; }
    public void setResolvedComplaints(long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; }

    public long getRejectedComplaints() { return rejectedComplaints; }
    public void setRejectedComplaints(long rejectedComplaints) { this.rejectedComplaints = rejectedComplaints; }

    public long getUrgentOpenComplaints() { return urgentOpenComplaints; }
    public void setUrgentOpenComplaints(long urgentOpenComplaints) { this.urgentOpenComplaints = urgentOpenComplaints; }

    public double getAverageResolutionTimeHours() { return averageResolutionTimeHours; }
    public void setAverageResolutionTimeHours(double averageResolutionTimeHours) { this.averageResolutionTimeHours = averageResolutionTimeHours; }

    public double getResolutionRatePercentage() { return resolutionRatePercentage; }
    public void setResolutionRatePercentage(double resolutionRatePercentage) { this.resolutionRatePercentage = resolutionRatePercentage; }

    public Map<String, Long> getComplaintsByCategory() { return complaintsByCategory; }
    public void setComplaintsByCategory(Map<String, Long> complaintsByCategory) { this.complaintsByCategory = complaintsByCategory; }

    public Map<String, Long> getComplaintsByPriority() { return complaintsByPriority; }
    public void setComplaintsByPriority(Map<String, Long> complaintsByPriority) { this.complaintsByPriority = complaintsByPriority; }

    public Map<String, Long> getComplaintsByStatus() { return complaintsByStatus; }
    public void setComplaintsByStatus(Map<String, Long> complaintsByStatus) { this.complaintsByStatus = complaintsByStatus; }

    public Map<String, Long> getComplaintsByDepartment() { return complaintsByDepartment; }
    public void setComplaintsByDepartment(Map<String, Long> complaintsByDepartment) { this.complaintsByDepartment = complaintsByDepartment; }

    public List<ComplaintResponse> getRecentComplaints() { return recentComplaints; }
    public void setRecentComplaints(List<ComplaintResponse> recentComplaints) { this.recentComplaints = recentComplaints; }

    public List<ComplaintResponse> getUrgentOpenList() { return urgentOpenList; }
    public void setUrgentOpenList(List<ComplaintResponse> urgentOpenList) { this.urgentOpenList = urgentOpenList; }
}
