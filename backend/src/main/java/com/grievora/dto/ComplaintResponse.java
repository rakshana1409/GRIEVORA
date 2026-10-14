package com.grievora.dto;

import com.grievora.entity.Complaint;
import com.grievora.entity.ComplaintPriority;
import com.grievora.entity.ComplaintStatus;
import java.time.LocalDateTime;

public class ComplaintResponse {
    private Long id;
    private String complaintReference;
    private String title;
    private String category;
    private String location;
    private String building;
    private String floorOrRoom;
    private ComplaintPriority priority;
    private String urgencyReason;
    private ComplaintStatus status;
    private String submittedByName;
    private String submittedByEmail;
    private String assignedToName;
    private String assignedDepartmentName;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    public ComplaintResponse() {}

    public static ComplaintResponse fromEntity(Complaint c) {
        if (c == null) return null;
        ComplaintResponse dto = new ComplaintResponse();
        dto.setId(c.getId());
        dto.setComplaintReference(c.getComplaintReference());
        dto.setTitle(c.getTitle());
        dto.setCategory(c.getCategory());
        dto.setLocation(c.getLocation());
        dto.setBuilding(c.getBuilding());
        dto.setFloorOrRoom(c.getFloorOrRoom());
        dto.setPriority(c.getPriority());
        dto.setUrgencyReason(c.getUrgencyReason());
        dto.setStatus(c.getStatus());
        if (c.getSubmittedBy() != null) {
            dto.setSubmittedByName(c.getSubmittedBy().getFullName());
            dto.setSubmittedByEmail(c.getSubmittedBy().getEmail());
        }
        if (c.getAssignedTo() != null) {
            dto.setAssignedToName(c.getAssignedTo().getFullName());
        }
        if (c.getAssignedDepartment() != null) {
            dto.setAssignedDepartmentName(c.getAssignedDepartment().getName());
        }
        dto.setSubmittedAt(c.getSubmittedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        dto.setResolvedAt(c.getResolvedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getComplaintReference() { return complaintReference; }
    public void setComplaintReference(String complaintReference) { this.complaintReference = complaintReference; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }

    public String getFloorOrRoom() { return floorOrRoom; }
    public void setFloorOrRoom(String floorOrRoom) { this.floorOrRoom = floorOrRoom; }

    public ComplaintPriority getPriority() { return priority; }
    public void setPriority(ComplaintPriority priority) { this.priority = priority; }

    public String getUrgencyReason() { return urgencyReason; }
    public void setUrgencyReason(String urgencyReason) { this.urgencyReason = urgencyReason; }

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }

    public String getSubmittedByName() { return submittedByName; }
    public void setSubmittedByName(String submittedByName) { this.submittedByName = submittedByName; }

    public String getSubmittedByEmail() { return submittedByEmail; }
    public void setSubmittedByEmail(String submittedByEmail) { this.submittedByEmail = submittedByEmail; }

    public String getAssignedToName() { return assignedToName; }
    public void setAssignedToName(String assignedToName) { this.assignedToName = assignedToName; }

    public String getAssignedDepartmentName() { return assignedDepartmentName; }
    public void setAssignedDepartmentName(String assignedDepartmentName) { this.assignedDepartmentName = assignedDepartmentName; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
