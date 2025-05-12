package com.skillshare.skillshare_platform.service;

import com.skillshare.skillshare_platform.dto.CommentRequestDto;
import com.skillshare.skillshare_platform.dto.CommentResponseDto;
import com.skillshare.skillshare_platform.dto.NotificationResponseDto;
import com.skillshare.skillshare_platform.entity.SkillPost;
import com.skillshare.skillshare_platform.exception.ResourceConflictException;
import com.skillshare.skillshare_platform.exception.ResourceNotFoundException;
import com.skillshare.skillshare_platform.entity.*;
import com.skillshare.skillshare_platform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class EngagementService {

    @Autowired
    private SkillPostRepository skillPostRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private LikeRepository likeRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private NotificationService notificationService;

    @Transactional
    public void likePost(Long postId, Long userId) {
        SkillPost post = skillPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        likeRepository.findByUserIdAndSkillPostId(userId, postId)
                .ifPresent(like -> {
                    throw new ResourceConflictException("User already liked this post");
                });

        Like like = new Like();
        like.setUser(user);
        like.setSkillPost(post);
        likeRepository.save(like);

        // Generate notification
        if (!user.getId().equals(post.getUser().getId())) {
            notificationService.createNotification(
                    post.getUser().getId(),
                    user.getId() + " liked your post",
                    "LIKE",
                    postId
            );
        }
    }

    @Transactional
    public void unlikePost(Long postId, Long userId) {
        Like like = likeRepository.findByUserIdAndSkillPostId(userId, postId)
                .orElseThrow(() -> new ResourceNotFoundException("Like not found"));
        likeRepository.delete(like);
    }

    @Transactional
    public CommentResponseDto addComment(Long postId, CommentRequestDto commentRequestDto) {
        SkillPost post = skillPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User user = userRepository.findById(commentRequestDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setSkillPost(post);
        comment.setContent(commentRequestDto.getContent());
        comment = commentRepository.save(comment);

        // Generate notification
        if (!user.getId().equals(post.getUser().getId())) {
            notificationService.createNotification(
                    post.getUser().getId(),
                    user.getId() + " commented on your post",
                    "COMMENT",
                    postId
            );
        }

        return mapToCommentResponseDto(comment);
    }

    @Transactional
    public CommentResponseDto editComment(Long commentId, CommentRequestDto commentRequestDto) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(commentRequestDto.getUserId())) {
            throw new ResourceConflictException("User not authorized to edit this comment");
        }

        comment.setContent(commentRequestDto.getContent());
        comment = commentRepository.save(comment);
        return mapToCommentResponseDto(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new ResourceConflictException("User not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    public List<CommentResponseDto> getPostComments(Long postId) {
        return commentRepository.findBySkillPostId(postId)
                .stream()
                .map(this::mapToCommentResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void sharePost(Long postId, Long userId) {
        SkillPost post = skillPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generate notification
        if (!user.getId().equals(post.getUser().getId())) {
            notificationService.createNotification(
                    post.getUser().getId(),
                    user.getId() + " shared your post",
                    "SHARE",
                    postId
            );
        }
    }

    private CommentResponseDto mapToCommentResponseDto(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setUserId(comment.getUser().getId());
        dto.setPostId(comment.getSkillPost().getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }

    // New method to fetch post author ID
    public Long getPostAuthorId(Long postId) {
        SkillPost post = skillPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        return post.getUser().getId(); // Get the user ID from the User entity
    }
}