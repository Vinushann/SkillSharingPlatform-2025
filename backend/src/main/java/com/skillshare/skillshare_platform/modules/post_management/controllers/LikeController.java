package com.skillshare.skillshare_platform.modules.post_management.controllers;

import com.skillshare.skillshare_platform.modules.post_management.dtos.LikeDTOs;
import com.skillshare.skillshare_platform.modules.post_management.services.LikeService;
import com.skillshare.skillshare_platform.modules.user_management.models.AppUser;
import com.skillshare.skillshare_platform.modules.user_management.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @Autowired
    AppUserRepository appUserRepository;

    // Toggle like for a post (add or remove like)
    @PostMapping("/{postId}/{userId}")
    public ResponseEntity<?> toggleLike(
            @PathVariable String postId,
            @PathVariable String userId) {
        AppUser currentUser = appUserRepository.getById(userId);
        LikeDTOs.LikeResponse response = likeService.toggleLike(postId, currentUser);

        if (response == null) {
            return ResponseEntity.ok().body("Like removed successfully.");
        } else {
            return ResponseEntity.ok(response);
        }
    }

    // Count likes for a specific post
    @GetMapping("/count/{postId}")
    public ResponseEntity<Long> countLikesForPost(@PathVariable String postId) {
        long likeCount = likeService.countLikesForPost(postId);
        return ResponseEntity.ok(likeCount);
    }

    // Check if the current user has liked a specific post
    @GetMapping("/check/{postId}/{userId}")
    public ResponseEntity<Boolean> hasUserLikedPost(
            @PathVariable String postId,
            @PathVariable String userId) {

        boolean hasLiked = likeService.hasUserLikedPost(postId, userId);
        return ResponseEntity.ok(hasLiked);
    }
}