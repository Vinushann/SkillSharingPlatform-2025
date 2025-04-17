package com.skillshare.skillshare_platform.dto;

import jakarta.validation.constraints.NotNull;

public class FollowRequestDto {

    @NotNull(message = "Follower ID is required")
    private Long followerId;

    @NotNull(message = "Followed ID is required")
    private Long followedId;

    // Getters and Setters
    public Long getFollowerId() {
        return followerId;
    }

    public void setFollowerId(Long followerId) {
        this.followerId = followerId;
    }

    public Long getFollowedId() {
        return followedId;
    }

    public void setFollowedId(Long followedId) {
        this.followedId = followedId;
    }
}