package com.skillshare.skillshare_platform.modules.post_management.dtos;

import java.util.Date;

public class CommentDTOs {

    public static class CommentResponse {
        private String id;
        private String content;
        private UserPostDTOs.UserSummaryDTO user;
        private Date commentedAt;

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public UserPostDTOs.UserSummaryDTO getUser() {
            return user;
        }

        public void setUser(UserPostDTOs.UserSummaryDTO user) {
            this.user = user;
        }

        public Date getCommentedAt() {
            return commentedAt;
        }

        public void setCommentedAt(Date commentedAt) {
            this.commentedAt = commentedAt;
        }
    }

    public static class CommentRequest {
        private String postId;
        private String content;

        // Getters and Setters
        public String getPostId() {
            return postId;
        }

        public void setPostId(String postId) {
            this.postId = postId;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}