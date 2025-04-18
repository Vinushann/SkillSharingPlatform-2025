package com.skillshare.skillshare_platform.modules.post_management.dtos;

import java.util.Date;
import java.util.List;

public class UserPostDTOs {

    public static class PostMediaDTO {
        private String url;
        private String mediaType;

        public PostMediaDTO() {}

        public PostMediaDTO(String url, String mediaType) {
            this.url = url;
            this.mediaType = mediaType;
        }

        // Getters and Setters
        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getMediaType() {
            return mediaType;
        }

        public void setMediaType(String mediaType) {
            this.mediaType = mediaType;
        }
    }

    public static class UserSummaryDTO {
        private String id;
        private String firstName;
        private String lastName;
        private String profileImageUrl;

        public UserSummaryDTO() {}

        public UserSummaryDTO(String id, String firstName, String lastName, String profileImageUrl) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.profileImageUrl = profileImageUrl;
        }

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getProfileImageUrl() {
            return profileImageUrl;
        }

        public void setProfileImageUrl(String profileImageUrl) {
            this.profileImageUrl = profileImageUrl;
        }
    }

    public static class PostRequest {
        private String caption;
        private List<PostMediaDTO> media;
        private List<String> taggedUserIds;

        // Getters and Setters
        public String getCaption() {
            return caption;
        }

        public void setCaption(String caption) {
            this.caption = caption;
        }

        public List<PostMediaDTO> getMedia() {
            return media;
        }

        public void setMedia(List<PostMediaDTO> media) {
            this.media = media;
        }

        public List<String> getTaggedUserIds() {
            return taggedUserIds;
        }

        public void setTaggedUserIds(List<String> taggedUserIds) {
            this.taggedUserIds = taggedUserIds;
        }
    }

    public static class PostResponse {
        private String id;
        private String caption;
        private UserSummaryDTO postedBy;
        private Date postedAt;
        private List<PostMediaDTO> media;
        private List<UserSummaryDTO> taggedUsers;
        private List<UserSummaryDTO> repostedBy;
        private int likeCount;
        private int commentCount;
        private boolean likedByCurrentUser;

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getCaption() {
            return caption;
        }

        public void setCaption(String caption) {
            this.caption = caption;
        }

        public UserSummaryDTO getPostedBy() {
            return postedBy;
        }

        public void setPostedBy(UserSummaryDTO postedBy) {
            this.postedBy = postedBy;
        }

        public Date getPostedAt() {
            return postedAt;
        }

        public void setPostedAt(Date postedAt) {
            this.postedAt = postedAt;
        }

        public List<PostMediaDTO> getMedia() {
            return media;
        }

        public void setMedia(List<PostMediaDTO> media) {
            this.media = media;
        }

        public List<UserSummaryDTO> getTaggedUsers() {
            return taggedUsers;
        }

        public void setTaggedUsers(List<UserSummaryDTO> taggedUsers) {
            this.taggedUsers = taggedUsers;
        }

        public List<UserSummaryDTO> getRepostedBy() {
            return repostedBy;
        }

        public void setRepostedBy(List<UserSummaryDTO> repostedBy) {
            this.repostedBy = repostedBy;
        }

        public int getLikeCount() {
            return likeCount;
        }

        public void setLikeCount(int likeCount) {
            this.likeCount = likeCount;
        }

        public int getCommentCount() {
            return commentCount;
        }

        public void setCommentCount(int commentCount) {
            this.commentCount = commentCount;
        }

        public boolean isLikedByCurrentUser() {
            return likedByCurrentUser;
        }

        public void setLikedByCurrentUser(boolean likedByCurrentUser) {
            this.likedByCurrentUser = likedByCurrentUser;
        }
    }

    public static class RepostRequest {
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