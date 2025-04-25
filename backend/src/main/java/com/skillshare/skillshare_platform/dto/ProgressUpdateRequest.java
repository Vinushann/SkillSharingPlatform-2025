package com.skillshare.skillshare_platform.dto;

import lombok.Data;

@Data
public class ProgressUpdateRequest {
    private Long userId;
    private String title;
    private String description;
    private String mediaUrl;
}
