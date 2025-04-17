package com.skillshare.skillshare_platform.service;

import com.skillshare.skillshare_platform.dto.FollowRequestDto;
import com.skillshare.skillshare_platform.dto.FollowResponseDto;
import com.skillshare.skillshare_platform.exception.ResourceConflictException;
import com.skillshare.skillshare_platform.exception.ResourceNotFoundException;
import com.skillshare.skillshare_platform.model.Follow;
import com.skillshare.skillshare_platform.model.User;
import com.skillshare.skillshare_platform.repository.FollowRepository;
import com.skillshare.skillshare_platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    @Autowired
    public FollowService(FollowRepository followRepository, UserRepository userRepository) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
    }

    public FollowResponseDto createFollow(FollowRequestDto followRequestDto) {
        // Validate follower exists
        User follower = userRepository.findById(followRequestDto.getFollowerId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + followRequestDto.getFollowerId()));

        // Validate followed exists
        User followed = userRepository.findById(followRequestDto.getFollowedId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + followRequestDto.getFollowedId()));

        // Prevent self-following
        if (follower.getUserId().equals(followed.getUserId())) {
            throw new ResourceConflictException("Cannot follow yourself");
        }

        // Check for duplicate follow
        if (followRepository.findByFollowerUserIdAndFollowedUserId(follower.getUserId(), followed.getUserId()).isPresent()) {
            throw new ResourceConflictException("Already following user with ID: " + followed.getUserId());
        }

        // Map DTO to entity
        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowed(followed);

        // Save and map to response
        Follow savedFollow = followRepository.save(follow);
        return mapToResponseDto(savedFollow);
    }

    public FollowResponseDto getFollowById(Long id) {
        Follow follow = followRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Follow not found with ID: " + id));
        return mapToResponseDto(follow);
    }

    public FollowResponseDto updateFollow(Long id, FollowRequestDto followRequestDto) {
        // Validate follow exists
        Follow follow = followRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Follow not found with ID: " + id));

        // Validate follower exists
        User follower = userRepository.findById(followRequestDto.getFollowerId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + followRequestDto.getFollowerId()));

        // Validate followed exists
        User followed = userRepository.findById(followRequestDto.getFollowedId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + followRequestDto.getFollowedId()));

        // Prevent self-following
        if (follower.getUserId().equals(followed.getUserId())) {
            throw new ResourceConflictException("Cannot follow yourself");
        }

        // Check for duplicate follow (excluding current follow)
        followRepository.findByFollowerUserIdAndFollowedUserId(follower.getUserId(), followed.getUserId())
                .ifPresent(existing -> {
                    if (!existing.getFollowId().equals(id)) {
                        throw new ResourceConflictException("Already following user with ID: " + followed.getUserId());
                    }
                });

        // Update fields
        follow.setFollower(follower);
        follow.setFollowed(followed);

        // Save and map to response
        Follow updatedFollow = followRepository.save(follow);
        return mapToResponseDto(updatedFollow);
    }

    public void deleteFollow(Long id) {
        if (!followRepository.existsById(id)) {
            throw new ResourceNotFoundException("Follow not found with ID: " + id);
        }
        followRepository.deleteById(id);
    }

    public List<FollowResponseDto> getAllFollows(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Follow> followPage = followRepository.findAll(pageable);
        return followPage.getContent().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    private FollowResponseDto mapToResponseDto(Follow follow) {
        FollowResponseDto responseDto = new FollowResponseDto();
        responseDto.setFollowId(follow.getFollowId());
        responseDto.setFollowerId(follow.getFollower().getUserId());
        responseDto.setFollowerUsername(follow.getFollower().getUsername());
        responseDto.setFollowedId(follow.getFollowed().getUserId());
        responseDto.setFollowedUsername(follow.getFollowed().getUsername());
        responseDto.setCreatedAt(follow.getCreatedAt());
        return responseDto;
    }
}