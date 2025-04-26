package com.skillshare.skillshare_platform.dto;

import lombok.Data;

@Data
public class CommentRequestDto {
    private Long userId;
    private String content;
}