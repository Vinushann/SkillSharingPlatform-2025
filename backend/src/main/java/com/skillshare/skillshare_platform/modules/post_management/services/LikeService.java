package com.skillshare.skillshare_platform.modules.post_management.services;

import com.skillshare.skillshare_platform.modules.post_management.dtos.UserPostDTOs;
import com.skillshare.skillshare_platform.modules.post_management.models.Like;
import com.skillshare.skillshare_platform.modules.post_management.repositories.LikeRepository;
import com.skillshare.skillshare_platform.modules.post_management.dtos.LikeDTOs;
import com.skillshare.skillshare_platform.modules.user_management.models.AppUser;
import com.skillshare.skillshare_platform.modules.post_management.models.UserPost;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    // Toggle like functionality (add or remove like)
    public LikeDTOs.LikeResponse toggleLike(String postId, AppUser currentUser) {
        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, currentUser.getId());

        if (existingLike.isPresent()) {
            // If the user already liked the post, remove the like
            likeRepository.delete(existingLike.get());
            return null; // Return null to indicate the like was removed
        } else {
            // If the user hasn't liked the post, add a new like
            Like newLike = new Like();
            newLike.setPost(new UserPost()); // Set the post object with the given ID
            newLike.getPost().setId(postId);
            newLike.setUser(currentUser);
            newLike.setLikedAt(new Date());
            Like savedLike = likeRepository.save(newLike);

            // Map the saved like to a response DTO
            LikeDTOs.LikeResponse response = new LikeDTOs.LikeResponse();
            response.setId(savedLike.getId());
            response.setLikedAt(savedLike.getLikedAt());
            response.setUser(mapToUserSummaryDTO(currentUser));
            return response;
        }
    }

    // Count likes for a specific post
    public long countLikesForPost(String postId) {
        return likeRepository.countByPostId(postId);
    }

    // Check if a user has liked a specific post
    public boolean hasUserLikedPost(String postId, String userId) {
        return likeRepository.existsByPostIdAndUserId(postId, userId);
    }

    // Helper method to map AppUser to UserSummaryDTO
    private UserPostDTOs.UserSummaryDTO mapToUserSummaryDTO(AppUser user) {
        UserPostDTOs.UserSummaryDTO userSummary = new UserPostDTOs.UserSummaryDTO();
        userSummary.setId(user.getId());
        userSummary.setFirstName(user.getUsername());
        userSummary.setProfileImageUrl(user.getProfileImageUrl());
        return userSummary;
    }
}