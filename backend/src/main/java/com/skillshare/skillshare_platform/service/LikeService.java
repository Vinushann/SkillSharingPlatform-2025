package com.skillshare.skillshare_platform.service;

import com.skillshare.skillshare_platform.dto.LikeRequestDto;
import com.skillshare.skillshare_platform.dto.LikeResponseDto;
import com.skillshare.skillshare_platform.exception.ResourceConflictException;
import com.skillshare.skillshare_platform.exception.ResourceNotFoundException;
import com.skillshare.skillshare_platform.model.Like;
import com.skillshare.skillshare_platform.model.SkillPost;
import com.skillshare.skillshare_platform.model.User;
import com.skillshare.skillshare_platform.repository.LikeRepository;
import com.skillshare.skillshare_platform.repository.SkillPostRepository;
import com.skillshare.skillshare_platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final SkillPostRepository skillPostRepository;

    @Autowired
    public LikeService(LikeRepository likeRepository, UserRepository userRepository, SkillPostRepository skillPostRepository) {
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.skillPostRepository = skillPostRepository;
    }

    public LikeResponseDto createLike(LikeRequestDto likeRequestDto) {
        // Validate user exists
        User user = userRepository.findById(likeRequestDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + likeRequestDto.getUserId()));

        // Validate post exists
        SkillPost post = skillPostRepository.findById(likeRequestDto.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill post not found with ID: " + likeRequestDto.getPostId()));

        // Check for duplicate like
        if (likeRepository.findByUserUserIdAndPostPostId(user.getUserId(), post.getPostId()).isPresent()) {
            throw new ResourceConflictException("User already liked post with ID: " + post.getPostId());
        }

        // Map DTO to entity
        Like like = new Like();
        like.setUser(user);
        like.setPost(post);

        // Save and map to response
        Like savedLike = likeRepository.save(like);
        return mapToResponseDto(savedLike);
    }

    public LikeResponseDto getLikeById(Long id) {
        Like like = likeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Like not found with ID: " + id));
        return mapToResponseDto(like);
    }

    public LikeResponseDto updateLike(Long id, LikeRequestDto likeRequestDto) {
        // Validate like exists
        Like like = likeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Like not found with ID: " + id));

        // Validate user exists
        User user = userRepository.findById(likeRequestDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + likeRequestDto.getUserId()));

        // Validate post exists
        SkillPost post = skillPostRepository.findById(likeRequestDto.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill post not found with ID: " + likeRequestDto.getPostId()));

        // Check for duplicate like (excluding current like)
        likeRepository.findByUserUserIdAndPostPostId(user.getUserId(), post.getPostId())
                .ifPresent(existing -> {
                    if (!existing.getLikeId().equals(id)) {
                        throw new ResourceConflictException("User already liked post with ID: " + post.getPostId());
                    }
                });

        // Update fields
        like.setUser(user);
        like.setPost(post);

        // Save and map to response
        Like updatedLike = likeRepository.save(like);
        return mapToResponseDto(updatedLike);
    }

    public void deleteLike(Long id) {
        Like like = likeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Like not found with ID: " + id));
        likeRepository.deleteById(id);
    }

    public Map<String, Object> getAllLikes(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Like> likePage = likeRepository.findAll(pageable);
        List<LikeResponseDto> likes = likePage.getContent().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", likes);
        response.put("page", likePage.getNumber());
        response.put("size", likePage.getSize());
        response.put("totalElements", likePage.getTotalElements());
        response.put("totalPages", likePage.getTotalPages());
        return response;
    }

    public Map<String, Object> getLikesByPostId(Long postId, int page, int size) {
        // Validate post exists
        skillPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill post not found with ID: " + postId));

        Pageable pageable = PageRequest.of(page, size);
        Page<Like> likePage = likeRepository.findByPostPostId(postId, pageable);
        List<LikeResponseDto> likes = likePage.getContent().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", likes);
        response.put("page", likePage.getNumber());
        response.put("size", likePage.getSize());
        response.put("totalElements", likePage.getTotalElements());
        response.put("totalPages", likePage.getTotalPages());
        return response;
    }

    private LikeResponseDto mapToResponseDto(Like like) {
        LikeResponseDto responseDto = new LikeResponseDto();
        responseDto.setLikeId(like.getLikeId());
        responseDto.setUserId(like.getUser().getUserId());
        responseDto.setUsername(like.getUser().getUsername());
        responseDto.setPostId(like.getPost().getPostId());
        responseDto.setPostTitle(like.getPost().getTitle());
        responseDto.setCreatedAt(like.getCreatedAt());
        return responseDto;
    }
}