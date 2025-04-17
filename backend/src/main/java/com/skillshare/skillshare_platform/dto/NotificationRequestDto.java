package com.skillshare.skillshare_platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class NotificationRequestDto {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Type is required")
    @Pattern(regexp = "^(LIKE|COMMENT|FOLLOW)$", message = "Type must be LIKE, COMMENT, or FOLLOW")
    private String type;

    @NotNull(message = "Reference ID is required")
    private Long referenceId;

    @Size(max = 255, message = "Message must not exceed 255 characters")
    private String message;

    private boolean isRead;

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(Long referenceId) {
        this.referenceId = referenceId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(boolean isRead) {
        this.isRead = isRead;
    }
}