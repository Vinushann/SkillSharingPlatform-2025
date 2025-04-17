package com.skillshare.skillshare_platform.service;

import com.skillshare.skillshare_platform.dto.SkillPostRequestDto;
import com.skillshare.skillshare_platform.dto.SkillPostResponseDto;
import com.skillshare.skillshare_platform.exception.ResourceNotFoundException;
import com.skillshare.skillshare_platform.model.SkillPost;
import com.skillshare.skillshare_platform.model.User;
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
public class SkillPostService {

    private final SkillPostRepository skillPostRepository;
    private final UserRepository userRepository;

    @Autowired
    public SkillPostService(SkillPostRepository skillPostRepository, UserRepository userRepository) {
        this.skillPostRepository = skillPostRepository;
        this.userRepository = userRepository;
    }

    public SkillPostResponseDto createSkillPost(SkillPostRequestDto dto) {
        // Validate user exists
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));

        // Map DTO to entity
        SkillPost post = new SkillPost();
        post.setUser(user);
        post.setTitle(dto.getTitle());
        post.setDescription(dto.getDescription());

        // Save and map to response
        SkillPost savedPost = skillPostRepository.save(post);
        return mapToResponseDto(savedPost);
    }

    public SkillPostResponseDto getSkillPostById(Long id) {
        SkillPost post = skillPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill post not found with ID: " + id));
        return mapToResponseDto(post);
    }

    public SkillPostResponseDto updateSkillPost(Long id, SkillPostRequestDto dto) {
        // Validate post exists
        SkillPost post = skillPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill post not found with ID: " + id));

        // Validate user exists
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));

        // Update fields
        post.setUser(user);
        post.setTitle(dto.getTitle());
        post.setDescription(dto.getDescription());

        // Save and map to response
        SkillPost updatedPost = skillPostRepository.save(post);
        return mapToResponseDto(updatedPost);
    }

    public void deleteSkillPost(Long id) {
        if (!skillPostRepository.existsById(id)) {
            throw new ResourceNotFoundException("Skill post not found with ID: " + id);
        }
        skillPostRepository.deleteById(id);
    }

    public Map<String, Object> getAllSkillPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SkillPost> postPage = skillPostRepository.findAll(pageable);
        List<SkillPostResponseDto> posts = postPage.getContent().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", posts);
        response.put("page", postPage.getNumber());
        response.put("size", postPage.getSize());
        response.put("totalElements", postPage.getTotalElements());
        response.put("totalPages", postPage.getTotalPages());
        return response;
    }

    public Map<String, Object> getSkillPostsByUserId(Long userId, int page, int size) {
        // Validate user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Pageable pageable = PageRequest.of(page, size);
        Page<SkillPost> postPage = skillPostRepository.findByUserUserId(userId, pageable);
        List<SkillPostResponseDto> posts = postPage.getContent().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", posts);
        response.put("page", postPage.getNumber());
        response.put("size", postPage.getSize());
        response.put("totalElements", postPage.getTotalElements());
        response.put("totalPages", postPage.getTotalPages());
        return response;
    }

    private SkillPostResponseDto mapToResponseDto(SkillPost post) {
        SkillPostResponseDto responseDto = new SkillPostResponseDto();
        responseDto.setPostId(post.getPostId());
        responseDto.setUserId(post.getUser().getUserId());
        responseDto.setUsername(post.getUser().getUsername());
        responseDto.setTitle(post.getTitle());
        responseDto.setDescription(post.getDescription());
        responseDto.setCreatedAt(post.getCreatedAt());
        responseDto.setUpdatedAt(post.getUpdatedAt());
        return responseDto;
    }
}