package com.skillshare.skillshare_platform.modules.post_management.controllers;

import com.skillshare.skillshare_platform.modules.post_management.dtos.CommentDTOs;
import com.skillshare.skillshare_platform.modules.post_management.services.CommentService;
import com.skillshare.skillshare_platform.modules.user_management.models.AppUser;
import com.skillshare.skillshare_platform.modules.user_management.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    AppUserRepository userRepository;

    // Create a new comment
    @PostMapping("/{userId}")
    public ResponseEntity<CommentDTOs.CommentResponse> createComment(
            @RequestBody CommentDTOs.CommentRequest request,
            @PathVariable String userId
    ) {
        AppUser currentUser = userRepository.getById(userId);
        CommentDTOs.CommentResponse response = commentService.createComment(request.getPostId(), request.getContent(), currentUser);
        return ResponseEntity.ok(response);
    }

    // Get all comments for a specific post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDTOs.CommentResponse>> getCommentsForPost(@PathVariable String postId) {
        List<CommentDTOs.CommentResponse> comments = commentService.getCommentsForPost(postId);
        return ResponseEntity.ok(comments);
    }

    // Update an existing comment
    @PutMapping("/{commentId}/{userId}")
    public ResponseEntity<CommentDTOs.CommentResponse> updateComment(
            @PathVariable String commentId,
            @RequestBody CommentDTOs.CommentRequest request,
            @PathVariable String userId
    ) {
        AppUser currentUser = userRepository.getById(userId);
        CommentDTOs.CommentResponse response = commentService.updateComment(commentId, request.getContent(), currentUser);
        return ResponseEntity.ok(response);
    }

    // Delete a comment by ID
    @DeleteMapping("/{commentId}/{userId}")
    public ResponseEntity<String> deleteComment(
            @PathVariable String commentId,
            @PathVariable String userId
    ) {
        AppUser currentUser = userRepository.getById(userId);
        commentService.deleteComment(commentId, currentUser);
        return ResponseEntity.ok("Comment deleted successfully.");
    }

    // Count comments for a specific post
    @GetMapping("/count/{postId}")
    public ResponseEntity<Long> countCommentsForPost(@PathVariable String postId) {
        long commentCount = commentService.countCommentsForPost(postId);
        return ResponseEntity.ok(commentCount);
    }
}