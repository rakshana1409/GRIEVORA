package com.grievora.dto;

import com.grievora.entity.ComplaintStatus;
import com.grievora.entity.ComplaintStatusHistory;
import java.time.LocalDateTime;

public class StatusHistoryResponse {
    private Long id;
    private ComplaintStatus previousStatus;
    private ComplaintStatus newStatus;
    private String changedByName;
    private String publicMessage;
    private LocalDateTime changedAt;

    public StatusHistoryResponse() {}

    public static StatusHistoryResponse fromEntity(ComplaintStatusHistory history) {
        if (history == null) return null;
        StatusHistoryResponse dto = new StatusHistoryResponse();
        dto.setId(history.getId());
        dto.setPreviousStatus(history.getPreviousStatus());
        dto.setNewStatus(history.getNewStatus());
        if (history.getChangedBy() != null) {
            dto.setChangedByName(history.getChangedBy().getFullName());
        } else {
            dto.setChangedByName("System");
        }
        dto.setPublicMessage(history.getPublicMessage());
        dto.setChangedAt(history.getChangedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ComplaintStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(ComplaintStatus previousStatus) { this.previousStatus = previousStatus; }

    public ComplaintStatus getNewStatus() { return newStatus; }
    public void setNewStatus(ComplaintStatus newStatus) { this.newStatus = newStatus; }

    public String getChangedByName() { return changedByName; }
    public void setChangedByName(String changedByName) { this.changedByName = changedByName; }

    public String getPublicMessage() { return publicMessage; }
    public void setPublicMessage(String publicMessage) { this.publicMessage = publicMessage; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
}
