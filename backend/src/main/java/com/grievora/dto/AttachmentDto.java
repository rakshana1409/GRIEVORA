package com.grievora.dto;

import com.grievora.entity.Attachment;
import java.time.LocalDateTime;

public class AttachmentDto {
    private Long id;
    private String originalFilename;
    private String contentType;
    private Long fileSize;
    private LocalDateTime createdAt;

    public AttachmentDto() {}

    public static AttachmentDto fromEntity(Attachment a) {
        if (a == null) return null;
        AttachmentDto dto = new AttachmentDto();
        dto.setId(a.getId());
        dto.setOriginalFilename(a.getOriginalFilename());
        dto.setContentType(a.getContentType());
        dto.setFileSize(a.getFileSize());
        dto.setCreatedAt(a.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOriginalFilename() { return originalFilename; }
    public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
