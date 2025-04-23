package com.skillshare.skillshare_platform.modules.post_management.controllers;

import com.skillshare.skillshare_platform.modules.post_management.dtos.UserPostDTOs;
import com.skillshare.skillshare_platform.modules.post_management.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    /**
     * Create a new post
     */
    @PostMapping
    public ResponseEntity<UserPostDTOs.PostResponse> createPost(
            @RequestParam String userId,
            @RequestBody UserPostDTOs.PostRequest postRequest) {
        try {
            UserPostDTOs.PostResponse response = postService.createPost(userId, postRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get a post by ID
     */
    @GetMapping("/{postId}")
    public ResponseEntity<UserPostDTOs.PostResponse> getPostById(
            @PathVariable String postId,
            @RequestParam String currentUserId) {
        try {
            UserPostDTOs.PostResponse response = postService.getPostById(postId, currentUserId);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get posts by user ID
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserPostDTOs.PostResponse>> getPostsByUserId(
            @PathVariable String userId,
            @RequestParam String currentUserId) {
        try {
            List<UserPostDTOs.PostResponse> responses = postService.getPostsByUserId(userId, currentUserId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all posts
     */
    @GetMapping
    public ResponseEntity<List<UserPostDTOs.PostResponse>> getAllPosts(
            @RequestParam String currentUserId) {
        try {
            List<UserPostDTOs.PostResponse> responses = postService.getAllPosts(currentUserId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update a post
     */
    @PutMapping("/{postId}")
    public ResponseEntity<UserPostDTOs.PostResponse> updatePost(
            @PathVariable String postId,
            @RequestParam String userId,
            @RequestBody UserPostDTOs.PostRequest postRequest) {
        try {
            UserPostDTOs.PostResponse response = postService.updatePost(postId, userId, postRequest);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete a post
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable String postId,
            @RequestParam String userId) {
        try {
            postService.deletePost(postId, userId);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Repost a post
     */
    @PostMapping("/{postId}/repost")
    public ResponseEntity<UserPostDTOs.PostResponse> repostPost(
            @PathVariable String postId,
            @RequestParam String userId) {
        try {
            UserPostDTOs.PostResponse response = postService.repostPost(postId, userId);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Remove a repost
     */
    @DeleteMapping("/{postId}/repost")
    public ResponseEntity<Void> removeRepost(
            @PathVariable String postId,
            @RequestParam String userId) {
        try {
            postService.removeRepost(postId, userId);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if a post exists
     */
    @GetMapping("/{postId}/exists")
    public ResponseEntity<Boolean> postExists(@PathVariable String postId) {
        try {
            boolean exists = postService.postExists(postId);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}