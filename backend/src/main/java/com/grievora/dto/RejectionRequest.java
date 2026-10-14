package com.grievora.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RejectionRequest {

    @NotBlank(message = "Rejection reason is mandatory")
    @Size(min = 10, max = 1000, message = "Rejection reason must be at least 10 characters explaining why the ticket was rejected")
    private String rejectionReason;

    public RejectionRequest() {}

    public RejectionRequest(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
