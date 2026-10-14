package com.grievora.dto;

import com.grievora.entity.Complaint;
import java.util.List;

public class ComplaintDetailResponse extends ComplaintResponse {
    private String description;
    private String resolutionNotes;
    private String rejectionReason;
    private List<StatusHistoryResponse> timeline;
    private List<CommentResponse> comments;
    private List<AttachmentDto> attachments;

    public ComplaintDetailResponse() {}

    public static ComplaintDetailResponse fromEntity(Complaint c, List<StatusHistoryResponse> timeline, List<CommentResponse> comments, List<AttachmentDto> attachments) {
        ComplaintDetailResponse dto = new ComplaintDetailResponse();
        dto.setId(c.getId());
        dto.setComplaintReference(c.getComplaintReference());
        dto.setTitle(c.getTitle());
        dto.setDescription(c.getDescription());
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
        dto.setResolutionNotes(c.getResolutionNotes());
        dto.setRejectionReason(c.getRejectionReason());
        dto.setTimeline(timeline);
        dto.setComments(comments);
        dto.setAttachments(attachments);
        return dto;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public List<StatusHistoryResponse> getTimeline() { return timeline; }
    public void setTimeline(List<StatusHistoryResponse> timeline) { this.timeline = timeline; }

    public List<CommentResponse> getComments() { return comments; }
    public void setComments(List<CommentResponse> comments) { this.comments = comments; }

    public List<AttachmentDto> getAttachments() { return attachments; }
    public void setAttachments(List<AttachmentDto> attachments) { this.attachments = attachments; }
}
