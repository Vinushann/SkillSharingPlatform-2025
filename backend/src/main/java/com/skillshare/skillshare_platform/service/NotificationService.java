// starts from here 
package com.skillshare.skillshare_platform.service;

import com.skillshare.skillshare_platform.dto.NotificationRequestDto;
import com.skillshare.skillshare_platform.dto.NotificationResponseDto;
import com.skillshare.skillshare_platform.exception.ResourceConflictException;
import com.skillshare.skillshare_platform.exception.ResourceNotFoundException;
import com.skillshare.skillshare_platform.model.*;
import com.skillshare.skillshare_platform.repository.*;
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
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SkillPostRepository skillPostRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository,
                               SkillPostRepository skillPostRepository, CommentRepository commentRepository,
                               LikeRepository likeRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.skillPostRepository = skillPostRepository;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
    }

    public NotificationResponseDto createNotification(NotificationRequestDto dto) {
        // Validate user exists
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));

        // Validate reference_id based on type
        validateReference(dto.getType(), dto.getReferenceId());

        // Check for duplicate notification
        if (notificationRepository.findByUserUserIdAndTypeAndReferenceId(user.getUserId(), dto.getType(), dto.getReferenceId()).isPresent()) {
            throw new ResourceConflictException("Notification already exists for user ID: " + user.getUserId() +
                    ", type: " + dto.getType() + ", reference ID: " + dto.getReferenceId());
        }

        // Map DTO to entity
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(dto.getType());
        notification.setReferenceId(dto.getReferenceId());
        notification.setMessage(dto.getMessage());
//        notification.setIsRead(dto.getIsRead());

        // Save and map to response
        Notification savedNotification = notificationRepository.save(notification);
        return mapToResponseDto(savedNotification);
    }

    public NotificationResponseDto getNotificationById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + id));
        return mapToResponseDto(notification);
    }

    public NotificationResponseDto updateNotification(Long id, NotificationRequestDto dto) {
        // Validate notification exists
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + id));

        // Validate user exists
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));

        // Check ownership
        if (!notification.getUser().getUserId().equals(user.getUserId())) {
            throw new ResourceConflictException("Cannot update notification for a different user");
        }

        // Validate reference_id
        validateReference(dto.getType(), dto.getReferenceId());

        // Check for duplicate (excluding current)
        notificationRepository.findByUserUserIdAndTypeAndReferenceId(user.getUserId(), dto.getType(), dto.getReferenceId())
                .ifPresent(existing -> {
                    if (!existing.getNotificationId().equals(id)) {
                        throw new ResourceConflictException("Notification already exists for user ID: " + user.getUserId() +
                                ", type: " + dto.getType() + ", reference ID: " + dto.getReferenceId());
                    }
                });

        // Update fields
        notification.setUser(user);
        notification.setType(dto.getType());
        notification.setReferenceId(dto.getReferenceId());
        notification.setMessage(dto.getMessage());
//        notification.setIsRead(dto.getIsRead());

        // Save and map to response
        Notification updatedNotification = notificationRepository.save(notification);
        return mapToResponseDto(updatedNotification);
    }

    public void deleteNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + id));
        notificationRepository.deleteById(id);
    }

    public Map<String, Object> getAllNotifications(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notificationPage = notificationRepository.findAll(pageable);
        List<NotificationResponseDto> notifications = notificationPage.getContent().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", notifications);
        response.put("page", notificationPage.getNumber());
        response.put("size", notificationPage.getSize());
        response.put("totalElements", notificationPage.getTotalElements());
        response.put("totalPages", notificationPage.getTotalPages());
        return response;
    }

    public Map<String, Object> getNotificationsByUserId(Long userId, int page, int size) {
        // Validate user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notificationPage = notificationRepository.findByUserUserId(userId, pageable);
        List<NotificationResponseDto> notifications = notificationPage.getContent().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", notifications);
        response.put("page", notificationPage.getNumber());
        response.put("size", notificationPage.getSize());
        response.put("totalElements", notificationPage.getTotalElements());
        response.put("totalPages", notificationPage.getTotalPages());
        return response;
    }

    private void validateReference(String type, Long referenceId) {
        switch (type) {
            case "LIKE":
                likeRepository.findById(referenceId)
                        .orElseThrow(() -> new ResourceNotFoundException("Like not found with ID: " + referenceId));
                break;
            case "COMMENT":
                commentRepository.findById(referenceId)
                        .orElseThrow(() -> new ResourceNotFoundException("Comment not found with ID: " + referenceId));
                break;
            case "FOLLOW":
                userRepository.findById(referenceId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + referenceId));
                break;
            default:
                throw new ResourceConflictException("Invalid notification type: " + type);
        }
    }

    private NotificationResponseDto mapToResponseDto(Notification notification) {
        NotificationResponseDto responseDto = new NotificationResponseDto();
        responseDto.setNotificationId(notification.getNotificationId());
        responseDto.setUserId(notification.getUser().getUserId());
        responseDto.setUsername(notification.getUser().getUsername());
        responseDto.setType(notification.getType());
        responseDto.setReferenceId(notification.getReferenceId());
        responseDto.setMessage(notification.getMessage());
//        responseDto.setIsRead(notification.getIsRead());
        responseDto.setCreatedAt(notification.getCreatedAt());
        responseDto.setUpdatedAt(notification.getUpdatedAt());
        return responseDto;
    }
}