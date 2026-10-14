package com.grievora.dto;

import java.util.List;
import java.util.Map;

public class ReportDto {
    private long totalReceived;
    private long totalResolved;
    private long totalOpen;
    private long totalRejected;
    private double resolutionRatePercentage;
    private double averageResolutionTimeHours;
    private double averageResolutionTimeDays;

    private Map<String, Long> categoryFrequency;
    private Map<String, Long> priorityDistribution;
    private Map<String, Long> departmentWorkload;
    private List<Map<String, Object>> recurringIssueHotspots;
    private List<ComplaintResponse> longPendingComplaints;

    public ReportDto() {}

    public long getTotalReceived() { return totalReceived; }
    public void setTotalReceived(long totalReceived) { this.totalReceived = totalReceived; }

    public long getTotalResolved() { return totalResolved; }
    public void setTotalResolved(long totalResolved) { this.totalResolved = totalResolved; }

    public long getTotalOpen() { return totalOpen; }
    public void setTotalOpen(long totalOpen) { this.totalOpen = totalOpen; }

    public long getTotalRejected() { return totalRejected; }
    public void setTotalRejected(long totalRejected) { this.totalRejected = totalRejected; }

    public double getResolutionRatePercentage() { return resolutionRatePercentage; }
    public void setResolutionRatePercentage(double resolutionRatePercentage) { this.resolutionRatePercentage = resolutionRatePercentage; }

    public double getAverageResolutionTimeHours() { return averageResolutionTimeHours; }
    public void setAverageResolutionTimeHours(double averageResolutionTimeHours) { this.averageResolutionTimeHours = averageResolutionTimeHours; }

    public double getAverageResolutionTimeDays() { return averageResolutionTimeDays; }
    public void setAverageResolutionTimeDays(double averageResolutionTimeDays) { this.averageResolutionTimeDays = averageResolutionTimeDays; }

    public Map<String, Long> getCategoryFrequency() { return categoryFrequency; }
    public void setCategoryFrequency(Map<String, Long> categoryFrequency) { this.categoryFrequency = categoryFrequency; }

    public Map<String, Long> getPriorityDistribution() { return priorityDistribution; }
    public void setPriorityDistribution(Map<String, Long> priorityDistribution) { this.priorityDistribution = priorityDistribution; }

    public Map<String, Long> getDepartmentWorkload() { return departmentWorkload; }
    public void setDepartmentWorkload(Map<String, Long> departmentWorkload) { this.departmentWorkload = departmentWorkload; }

    public List<Map<String, Object>> getRecurringIssueHotspots() { return recurringIssueHotspots; }
    public void setRecurringIssueHotspots(List<Map<String, Object>> recurringIssueHotspots) { this.recurringIssueHotspots = recurringIssueHotspots; }

    public List<ComplaintResponse> getLongPendingComplaints() { return longPendingComplaints; }
    public void setLongPendingComplaints(List<ComplaintResponse> longPendingComplaints) { this.longPendingComplaints = longPendingComplaints; }
}
