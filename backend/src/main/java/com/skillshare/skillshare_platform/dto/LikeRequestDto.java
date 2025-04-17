package com.skillshare.skillshare_platform.dto;

import jakarta.validation.constraints.NotNull;

public class LikeRequestDto {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Post ID is required")
    private Long postId;

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }
}