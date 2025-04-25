package com.skillshare.skillshare_platform.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProgressUpdateResponse {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private String mediaUrl;
    private LocalDateTime createdAt;
}
