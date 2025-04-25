package com.skillshare.skillshare_platform.modules.goal_management.dtos;
import com.skillshare.skillshare_platform.modules.goal_management.models.GoalStatus;

import java.util.Date;

public class GoalDTOs {

    // Request DTO for creating or updating a goal
    public static class GoalRequest {
        private String description;
        private Date targetDate;
        private GoalStatus status;  // Added nullable status field

        // Getters and Setters
        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Date getTargetDate() {
            return targetDate;
        }

        public void setTargetDate(Date targetDate) {
            this.targetDate = targetDate;
        }

        // New getter and setter for status
        public GoalStatus getStatus() {
            return status;
        }

        public void setStatus(GoalStatus status) {
            this.status = status;
        }
    }


    // Response DTO for a goal
    public static class GoalResponse {
        private String id;
        private String description;
        private GoalStatus status;
        private Date targetDate;
        private Date createdAt;
        private Date updatedAt;

        // User details
        private UserSummaryDTO user;

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public GoalStatus getStatus() {
            return status;
        }

        public void setStatus(GoalStatus status) {
            this.status = status;
        }

        public Date getTargetDate() {
            return targetDate;
        }

        public void setTargetDate(Date targetDate) {
            this.targetDate = targetDate;
        }

        public Date getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Date createdAt) {
            this.createdAt = createdAt;
        }

        public Date getUpdatedAt() {
            return updatedAt;
        }

        public void setUpdatedAt(Date updatedAt) {
            this.updatedAt = updatedAt;
        }

        public UserSummaryDTO getUser() {
            return user;
        }

        public void setUser(UserSummaryDTO user) {
            this.user = user;
        }
    }

    // User summary DTO (used in responses)
    public static class UserSummaryDTO {
        private String id;
        private String firstName;
        private String lastName;
        private String profileImageUrl;

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
}