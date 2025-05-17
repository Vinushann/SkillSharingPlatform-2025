//package com.skillshare.skillshare_platform.controller;
//
//import com.skillshare.skillshare_platform.dto.CommentRequestDto;
//import com.skillshare.skillshare_platform.dto.CommentResponseDto;
//import com.skillshare.skillshare_platform.exception.ResourceNotFoundException;
//import com.skillshare.skillshare_platform.service.EngagementService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/v1/engagement")
//public class EngagementController {
//
//    @Autowired
//    private EngagementService engagementService;
//
//    @PostMapping("/posts/{postId}/like")
//    public ResponseEntity<String> likePost(@PathVariable Long postId, @RequestParam Long userId) {
//        engagementService.likePost(postId, userId);
//        return ResponseEntity.ok("Post liked successfully");
//    }
//
//    @DeleteMapping("/posts/{postId}/unlike")
//    public ResponseEntity<String> unlikePost(@PathVariable Long postId, @RequestParam Long userId) {
//        engagementService.unlikePost(postId, userId);
//        return ResponseEntity.ok("Post unliked successfully");
//    }
//
//    @PostMapping("/posts/{postId}/comment")
//    public ResponseEntity<CommentResponseDto> addComment(@PathVariable Long postId,
//                                                         @RequestBody CommentRequestDto commentRequestDto) {
//        return ResponseEntity.ok(engagementService.addComment(postId, commentRequestDto));
//    }
//
//    @PutMapping("/comments/{commentId}")
//    public ResponseEntity<CommentResponseDto> editComment(@PathVariable Long commentId,
//                                                          @RequestBody CommentRequestDto commentRequestDto) {
//        return ResponseEntity.ok(engagementService.editComment(commentId, commentRequestDto));
//    }
//
//    @DeleteMapping("/comments/{commentId}")
//    public ResponseEntity<String> deleteComment(@PathVariable Long commentId, @RequestParam Long userId) {
//        engagementService.deleteComment(commentId, userId);
//        return ResponseEntity.ok("Comment deleted successfully");
//    }
//
//    @GetMapping("/posts/{postId}/comments")
//    public ResponseEntity<List<CommentResponseDto>> getPostComments(@PathVariable Long postId) {
//        return ResponseEntity.ok(engagementService.getPostComments(postId));
//    }
//
//    @PostMapping("/posts/{postId}/share")
//    public ResponseEntity<String> sharePost(@PathVariable Long postId, @RequestParam Long userId) {
//        engagementService.sharePost(postId, userId);
//        return ResponseEntity.ok("Post shared successfully");
//    }
//}
// src/main/java/com/skillshare/skillshare_platform/controller/EngagementController.java

// src/main/java/com/skillshare/skillshare_platform/controller/EngagementController.java
// src/main/java/com/skillshare/skillshare_platform/controller/EngagementController.java
package com.skillshare.skillshare_platform.controller;

import com.skillshare.skillshare_platform.dto.CommentRequestDto;
import com.skillshare.skillshare_platform.dto.CommentResponseDto;
import com.skillshare.skillshare_platform.dto.NotificationResponseDto;
import com.skillshare.skillshare_platform.entity.Notification;
import com.skillshare.skillshare_platform.exception.ResourceNotFoundException;
import com.skillshare.skillshare_platform.service.EngagementService;
import com.skillshare.skillshare_platform.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/engagement")

public class EngagementController {

    private final EngagementService engagementService;
    private final NotificationService notificationService;

    @Autowired
    public EngagementController(EngagementService engagementService, NotificationService notificationService) {
        this.engagementService = engagementService;
        this.notificationService = notificationService;
    }

    // Existing Engagement Endpoints
    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<String> likePost(@PathVariable Long postId, @RequestParam Long userId) {
        engagementService.likePost(postId, userId);
        notificationService.createNotification(
                getPostAuthorId(postId),
                String.format("User %d liked your post", userId),
                "LIKE",
                postId
        );
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
        CommentResponseDto comment = engagementService.addComment(postId, commentRequestDto);
        notificationService.createNotification(
                getPostAuthorId(postId),
                String.format("User %d commented on your post", commentRequestDto.getUserId()),
                "COMMENT",
                postId
        );
        return ResponseEntity.ok(comment);
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
        notificationService.createNotification(
                getPostAuthorId(postId),
                String.format("User %d shared your post", userId),
                "SHARE",
                postId
        );
        return ResponseEntity.ok("Post shared successfully");
    }

    // New Notification Endpoints
    @PostMapping("/notifications")
    public ResponseEntity<NotificationResponseDto> createNotification(
            @RequestParam Long recipientId,
            @RequestParam String message,
            @RequestParam String type,
            @RequestParam(required = false) Long relatedPostId) {
        NotificationResponseDto notification = notificationService.createNotification(recipientId, message, type, relatedPostId);
        return ResponseEntity.ok(notification);
    }

    @GetMapping("/notifications/user/{recipientId}")
    public ResponseEntity<List<NotificationResponseDto>> getNotificationsByUser(@PathVariable Long recipientId) {
        return ResponseEntity.ok(notificationService.getNotificationsByUser(recipientId));
    }

    @GetMapping("/notifications/user/{recipientId}/unread")
    public ResponseEntity<List<NotificationResponseDto>> getUnreadNotifications(@PathVariable Long recipientId) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(recipientId));
    }

    @PutMapping("/notifications/{notificationId}/read")
    public ResponseEntity<NotificationResponseDto> markNotificationAsRead(@PathVariable Long notificationId) {
        return ResponseEntity.ok(notificationService.markAsRead(notificationId));
    }

    @DeleteMapping("/notifications/{notificationId}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok("Notification deleted successfully");
    }

    private Long getPostAuthorId(Long postId) {
        return engagementService.getPostAuthorId(postId);
    }
}