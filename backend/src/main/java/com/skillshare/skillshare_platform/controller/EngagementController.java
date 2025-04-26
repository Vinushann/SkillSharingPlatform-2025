package com.skillshare.skillshare_platform.controller;

import com.skillshare.skillshare_platform.dto.CommentRequestDto;
import com.skillshare.skillshare_platform.dto.CommentResponseDto;
import com.skillshare.skillshare_platform.exception.ResourceNotFoundException;
import com.skillshare.skillshare_platform.service.EngagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/engagement")
public class EngagementController {

    @Autowired
    private EngagementService engagementService;

    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<String> likePost(@PathVariable Long postId, @RequestParam Long userId) {
        engagementService.likePost(postId, userId);
        return ResponseEntity.ok("Post liked successfully");
    }

    @DeleteMapping("/posts/{postId}/unlike")
    public ResponseEntity<String> unlikePost(@PathVariable Long postId, @RequestParam Long userId) {
        engagementService.unlikePost(postId, userId);
        return ResponseEntity.ok("Post unliked successfully");
    }

    @PostMapping("/posts/{postId}/comment")
    public ResponseEntity<CommentResponseDto> addComment(@PathVariable Long postId,
                                                         @RequestBody CommentRequestDto commentRequestDto) {
        return ResponseEntity.ok(engagementService.addComment(postId, commentRequestDto));
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentResponseDto> editComment(@PathVariable Long commentId,
                                                          @RequestBody CommentRequestDto commentRequestDto) {
        return ResponseEntity.ok(engagementService.editComment(commentId, commentRequestDto));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId, @RequestParam Long userId) {
        engagementService.deleteComment(commentId, userId);
        return ResponseEntity.ok("Comment deleted successfully");
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponseDto>> getPostComments(@PathVariable Long postId) {
        return ResponseEntity.ok(engagementService.getPostComments(postId));
    }

    @PostMapping("/posts/{postId}/share")
    public ResponseEntity<String> sharePost(@PathVariable Long postId, @RequestParam Long userId) {
        engagementService.sharePost(postId, userId);
        return ResponseEntity.ok("Post shared successfully");
    }
}
