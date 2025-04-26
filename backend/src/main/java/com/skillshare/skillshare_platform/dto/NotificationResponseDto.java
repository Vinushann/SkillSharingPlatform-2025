package com.skillshare.skillshare_platform.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationResponseDto {
    private Long id;
    private Long recipientId;
    private String message;
    private String type;
    private Long relatedPostId;
    private boolean isRead;
    private LocalDateTime createdAt;
}