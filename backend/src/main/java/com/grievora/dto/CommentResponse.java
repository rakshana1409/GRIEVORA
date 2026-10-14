package com.grievora.dto;

import com.grievora.entity.CommentVisibility;
import com.grievora.entity.ComplaintComment;
import com.grievora.entity.Role;
import java.time.LocalDateTime;

public class CommentResponse {
    private Long id;
    private Long complaintId;
    private Long authorId;
    private String authorName;
    private Role authorRole;
    private String message;
    private CommentVisibility visibility;
    private LocalDateTime createdAt;

    public CommentResponse() {}

    public static CommentResponse fromEntity(ComplaintComment comment) {
        if (comment == null) return null;
        CommentResponse dto = new CommentResponse();
        dto.setId(comment.getId());
        dto.setComplaintId(comment.getComplaint().getId());
        if (comment.getAuthor() != null) {
            dto.setAuthorId(comment.getAuthor().getId());
            dto.setAuthorName(comment.getAuthor().getFullName());
            dto.setAuthorRole(comment.getAuthor().getRole());
        }
        dto.setMessage(comment.getMessage());
        dto.setVisibility(comment.getVisibility());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public Role getAuthorRole() { return authorRole; }
    public void setAuthorRole(Role authorRole) { this.authorRole = authorRole; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public CommentVisibility getVisibility() { return visibility; }
    public void setVisibility(CommentVisibility visibility) { this.visibility = visibility; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
