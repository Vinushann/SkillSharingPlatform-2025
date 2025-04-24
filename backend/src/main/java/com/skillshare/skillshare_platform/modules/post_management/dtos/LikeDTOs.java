package com.skillshare.skillshare_platform.modules.post_management.dtos;

import java.util.Date;

public class LikeDTOs {

    public static class LikeResponse {
        private String id;
        private UserPostDTOs.UserSummaryDTO user;
        private Date likedAt;

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public UserPostDTOs.UserSummaryDTO getUser() {
            return user;
        }

        public void setUser(UserPostDTOs.UserSummaryDTO user) {
            this.user = user;
        }

        public Date getLikedAt() {
            return likedAt;
        }

        public void setLikedAt(Date likedAt) {
            this.likedAt = likedAt;
        }
    }

    public static class LikeRequest {
        private String postId;

        // Getters and Setters
        public String getPostId() {
            return postId;
        }

        public void setPostId(String postId) {
            this.postId = postId;
        }
    }
}