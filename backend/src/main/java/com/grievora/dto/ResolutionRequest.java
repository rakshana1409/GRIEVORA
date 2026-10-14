package com.grievora.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResolutionRequest {

    @NotBlank(message = "Resolution notes are mandatory when marking complaint resolved")
    @Size(min = 10, max = 2000, message = "Resolution notes must be at least 10 characters detailing the fix")
    private String resolutionNotes;

    public ResolutionRequest() {}

    public ResolutionRequest(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
}
