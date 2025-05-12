package com.skillshare.skillshare_platform.modules.post_management.services;

import com.skillshare.skillshare_platform.modules.post_management.dtos.UserPostDTOs;
import com.skillshare.skillshare_platform.modules.post_management.models.Comment;
import com.skillshare.skillshare_platform.modules.post_management.repositories.CommentRepository;
import com.skillshare.skillshare_platform.modules.post_management.dtos.CommentDTOs;
import com.skillshare.skillshare_platform.modules.user_management.models.AppUser;
import com.skillshare.skillshare_platform.modules.post_management.models.UserPost;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    // Create a new comment
    public CommentDTOs.CommentResponse createComment(String postId, String content, AppUser currentUser) {
        Comment newComment = new Comment();
        newComment.setContent(content);
        newComment.setPost(new UserPost());
        newComment.getPost().setId(postId);
        newComment.setUser(currentUser);
        newComment.setCommentedAt(new Date());

        Comment savedComment = commentRepository.save(newComment);

        return mapToCommentResponse(savedComment);
    }

    // Get all comments for a specific post (newest first)
    public List<CommentDTOs.CommentResponse> getCommentsForPost(String postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCommentedAtDesc(postId);
        return comments.stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
    }

    // Update an existing comment
    public CommentDTOs.CommentResponse updateComment(String commentId, String content, AppUser currentUser) {
        Optional<Comment> optionalComment = commentRepository.findById(commentId);

        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();

            // Ensure the user owns the comment
            if (!comment.getUser().getId().equals(currentUser.getId())) {
                throw new IllegalArgumentException("You are not authorized to edit this comment.");
            }

            comment.setContent(content);
            Comment updatedComment = commentRepository.save(comment);

            return mapToCommentResponse(updatedComment);
        } else {
            throw new IllegalArgumentException("Comment not found.");
        }
    }

    // Delete a comment by ID
    public void deleteComment(String commentId, AppUser currentUser) {
        Optional<Comment> optionalComment = commentRepository.findById(commentId);

        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();

            // Ensure the user owns the comment
            if (!comment.getUser().getId().equals(currentUser.getId())) {
                throw new IllegalArgumentException("You are not authorized to delete this comment.");
            }

            commentRepository.delete(comment);
        } else {
            throw new IllegalArgumentException("Comment not found.");
        }
    }

    // Count comments for a specific post
    public long countCommentsForPost(String postId) {
        return commentRepository.countByPostId(postId);
    }

    // Map Comment entity to CommentResponse DTO
    private CommentDTOs.CommentResponse mapToCommentResponse(Comment comment) {
        CommentDTOs.CommentResponse response = new CommentDTOs.CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setCommentedAt(comment.getCommentedAt());

        UserPostDTOs.UserSummaryDTO userSummary = new UserPostDTOs.UserSummaryDTO();
        userSummary.setId(comment.getUser().getId());
        userSummary.setFirstName(comment.getUser().getFirstName());
        userSummary.setLastName(comment.getUser().getLastName());
        userSummary.setProfileImageUrl(comment.getUser().getProfileImageUrl());

        response.setUser(userSummary);
        return response;
    }
}