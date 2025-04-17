package com.skillshare.skillshare_platform.service;

import com.skillshare.skillshare_platform.dto.MediaRequestDto;
import com.skillshare.skillshare_platform.dto.MediaResponseDto;
import com.skillshare.skillshare_platform.exception.ResourceConflictException;
import com.skillshare.skillshare_platform.exception.ResourceNotFoundException;
import com.skillshare.skillshare_platform.model.Media;
import com.skillshare.skillshare_platform.model.SkillPost;
import com.skillshare.skillshare_platform.repository.MediaRepository;
import com.skillshare.skillshare_platform.repository.SkillPostRepository;
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
public class MediaService {

    private static final int MAX_MEDIA_PER_POST = 5;
    private static final long MAX_FILE_SIZE_MB = 100;

    private final MediaRepository mediaRepository;
    private final SkillPostRepository skillPostRepository;

    @Autowired
    public MediaService(MediaRepository mediaRepository, SkillPostRepository skillPostRepository) {
        this.mediaRepository = mediaRepository;
        this.skillPostRepository = skillPostRepository;
    }

    public MediaResponseDto createMedia(MediaRequestDto mediaRequestDto) {
        // Validate post exists
        SkillPost post = skillPostRepository.findById(mediaRequestDto.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill post not found with ID: " + mediaRequestDto.getPostId()));

        // Check media limit per post
        long mediaCount = mediaRepository.countByPostPostId(post.getPostId());
        if (mediaCount >= MAX_MEDIA_PER_POST) {
            throw new ResourceConflictException("Maximum media limit (" + MAX_MEDIA_PER_POST + ") reached for post ID: " + post.getPostId());
        }

        // Check for duplicate URL
        if (mediaRepository.findByPostPostIdAndUrl(post.getPostId(), mediaRequestDto.getUrl()).isPresent()) {
            throw new ResourceConflictException("Media with URL already exists for post ID: " + post.getPostId());
        }

        // Simulate file size validation (in real app, check via HTTP headers or storage service)
        validateFileSize(mediaRequestDto.getUrl());

        // Map DTO to entity
        Media media = new Media();
        media.setPost(post);
        media.setUrl(mediaRequestDto.getUrl());
        media.setMediaType(mediaRequestDto.getMediaType());

        // Save and map to response
        Media savedMedia = mediaRepository.save(media);
        return mapToResponseDto(savedMedia);
    }

    public MediaResponseDto getMediaById(Long id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with ID: " + id));
        return mapToResponseDto(media);
    }

    public MediaResponseDto updateMedia(Long id, MediaRequestDto mediaRequestDto) {
        // Validate media exists
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with ID: " + id));

        // Validate post exists
        SkillPost post = skillPostRepository.findById(mediaRequestDto.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill post not found with ID: " + mediaRequestDto.getPostId()));

        // Prevent changing post_id
        if (!media.getPost().getPostId().equals(post.getPostId())) {
            throw new ResourceConflictException("Cannot change post ID for media");
        }

        // Check for duplicate URL (excluding current media)
        mediaRepository.findByPostPostIdAndUrl(post.getPostId(), mediaRequestDto.getUrl())
                .ifPresent(existing -> {
                    if (!existing.getMediaId().equals(id)) {
                        throw new ResourceConflictException("Media with URL already exists for post ID: " + post.getPostId());
                    }
                });

        // Simulate file size validation
        validateFileSize(mediaRequestDto.getUrl());

        // Update fields
        media.setUrl(mediaRequestDto.getUrl());
        media.setMediaType(mediaRequestDto.getMediaType());

        // Save and map to response
        Media updatedMedia = mediaRepository.save(media);
        return mapToResponseDto(updatedMedia);
    }

    public void deleteMedia(Long id) {
        if (!mediaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Media not found with ID: " + id);
        }
        mediaRepository.deleteById(id);
    }

    public Map<String, Object> getAllMedia(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Media> mediaPage = mediaRepository.findAll(pageable);
        List<MediaResponseDto> mediaList = mediaPage.getContent().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", mediaList);
        response.put("page", mediaPage.getNumber());
        response.put("size", mediaPage.getSize());
        response.put("totalElements", mediaPage.getTotalElements());
        response.put("totalPages", mediaPage.getTotalPages());
        return response;
    }

    public Map<String, Object> getMediaByPostId(Long postId, int page, int size) {
        // Validate post exists
        skillPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill post not found with ID: " + postId));

        Pageable pageable = PageRequest.of(page, size);
        Page<Media> mediaPage = mediaRepository.findByPostPostId(postId, pageable);
        List<MediaResponseDto> mediaList = mediaPage.getContent().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", mediaList);
        response.put("page", mediaPage.getNumber());
        response.put("size", mediaPage.getSize());
        response.put("totalElements", mediaPage.getTotalElements());
        response.put("totalPages", mediaPage.getTotalPages());
        return response;
    }

    private void validateFileSize(String url) {
        // Simulate file size check (in real app, use HTTP HEAD request or storage API)
        // Assume file is accessible and size is within limit
        if (url.length() > 200) { // Placeholder for size simulation
            throw new ResourceConflictException("Media file size exceeds limit of " + MAX_FILE_SIZE_MB + "MB");
        }
    }

    private MediaResponseDto mapToResponseDto(Media media) {
        MediaResponseDto responseDto = new MediaResponseDto();
        responseDto.setMediaId(media.getMediaId());
        responseDto.setPostId(media.getPost().getPostId());
        responseDto.setPostTitle(media.getPost().getTitle());
        responseDto.setUrl(media.getUrl());
        responseDto.setMediaType(media.getMediaType());
        responseDto.setCreatedAt(media.getCreatedAt());
        responseDto.setUpdatedAt(media.getUpdatedAt());
        return responseDto;
    }
}