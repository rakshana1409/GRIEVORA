package com.grievora.dto;

import com.grievora.entity.ComplaintPriority;
import jakarta.validation.constraints.NotNull;

public class PriorityUpdateRequest {

    @NotNull(message = "Priority is required")
    private ComplaintPriority priority;

    private String reason;

    public PriorityUpdateRequest() {}

    public ComplaintPriority getPriority() { return priority; }
    public void setPriority(ComplaintPriority priority) { this.priority = priority; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
