package com.grievora.dto;

import com.grievora.entity.CommentVisibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CommentRequest {

    @NotBlank(message = "Comment message cannot be empty")
    @Size(max = 1000, message = "Comment cannot exceed 1000 characters")
    private String message;

    private CommentVisibility visibility = CommentVisibility.PUBLIC;

    public CommentRequest() {}

    public CommentRequest(String message, CommentVisibility visibility) {
        this.message = message;
        this.visibility = visibility;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public CommentVisibility getVisibility() { return visibility; }
    public void setVisibility(CommentVisibility visibility) { this.visibility = visibility; }
}
