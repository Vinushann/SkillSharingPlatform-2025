package com.skillshare.skillshare_platform.service;

import com.skillshare.skillshare_platform.dto.CommentRequestDto;
import com.skillshare.skillshare_platform.dto.CommentResponseDto;
import com.skillshare.skillshare_platform.exception.ResourceNotFoundException;
import com.skillshare.skillshare_platform.model.Comment;
import com.skillshare.skillshare_platform.model.SkillPost;
import com.skillshare.skillshare_platform.model.User;
import com.skillshare.skillshare_platform.repository.CommentRepository;
import com.skillshare.skillshare_platform.repository.SkillPostRepository;
import com.skillshare.skillshare_platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final SkillPostRepository skillPostRepository;
    private final UserRepository userRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository, SkillPostRepository skillPostRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.skillPostRepository = skillPostRepository;
        this.userRepository = userRepository;
    }

    public CommentResponseDto createComment(CommentRequestDto commentRequestDto) {
        // Validate post exists
        SkillPost post = skillPostRepository.findById(commentRequestDto.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill post not found with ID: " + commentRequestDto.getPostId()));

        // Validate user exists
        User user = userRepository.findById(commentRequestDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + commentRequestDto.getUserId()));

        // Map DTO to entity
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(commentRequestDto.getContent());

        // Save and map to response
        Comment savedComment = commentRepository.save(comment);
        return mapToResponseDto(savedComment);
    }

    public CommentResponseDto getCommentById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with ID: " + id));
        return mapToResponseDto(comment);
    }

    public CommentResponseDto updateComment(Long id, CommentRequestDto commentRequestDto) {
        // Validate comment exists
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with ID: " + id));

        // Validate post exists
        SkillPost post = skillPostRepository.findById(commentRequestDto.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill post not found with ID: " + commentRequestDto.getPostId()));

        // Validate user exists
        User user = userRepository.findById(commentRequestDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + commentRequestDto.getUserId()));

        // Update fields
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(commentRequestDto.getContent());

        // Save and map to response
        Comment updatedComment = commentRepository.save(comment);
        return mapToResponseDto(updatedComment);
    }

    public void deleteComment(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Comment not found with ID: " + id);
        }
        commentRepository.deleteById(id);
    }

    public List<CommentResponseDto> getAllComments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> commentPage = commentRepository.findAll(pageable);
        return commentPage.getContent().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    private CommentResponseDto mapToResponseDto(Comment comment) {
        CommentResponseDto responseDto = new CommentResponseDto();
        responseDto.setCommentId(comment.getCommentId());
        responseDto.setPostId(comment.getPost().getPostId());
        responseDto.setUserId(comment.getUser().getUserId());
        responseDto.setUsername(comment.getUser().getUsername());
        responseDto.setContent(comment.getContent());
        responseDto.setCreatedAt(comment.getCreatedAt());
        responseDto.setUpdatedAt(comment.getUpdatedAt());
        return responseDto;
    }
}