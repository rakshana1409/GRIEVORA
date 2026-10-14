package com.grievora.dto;

import com.grievora.entity.ComplaintPriority;
import com.grievora.entity.ComplaintStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ComplaintStatusUpdateRequest {

    @NotNull(message = "New status is required")
    private ComplaintStatus newStatus;

    @NotBlank(message = "Status update message for the complainant is required")
    @Size(min = 5, max = 500, message = "Status update message must be between 5 and 500 characters")
    private String updateMessage;

    public ComplaintStatusUpdateRequest() {}

    public ComplaintStatus getNewStatus() { return newStatus; }
    public void setNewStatus(ComplaintStatus newStatus) { this.newStatus = newStatus; }

    public String getUpdateMessage() { return updateMessage; }
    public void setUpdateMessage(String updateMessage) { this.updateMessage = updateMessage; }
}
