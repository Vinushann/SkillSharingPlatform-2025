package com.skillshare.skillshare_platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProgressUpdateRequestDto {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Template type is required")
    private String templateType;

    @NotBlank(message = "Details are required")
    private String details;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTemplateType() {
        return templateType;
    }

    public void setTemplateType(String templateType) {
        this.templateType = templateType;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}