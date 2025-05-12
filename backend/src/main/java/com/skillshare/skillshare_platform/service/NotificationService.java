// src/main/java/com/skillshare/skillshare_platform/service/NotificationService.java
package com.skillshare.skillshare_platform.service;

import com.skillshare.skillshare_platform.dto.NotificationResponseDto;
import com.skillshare.skillshare_platform.exception.ResourceNotFoundException;
import com.skillshare.skillshare_platform.entity.Notification;
import com.skillshare.skillshare_platform.entity.User;
import com.skillshare.skillshare_platform.repository.NotificationRepository;
import com.skillshare.skillshare_platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public NotificationResponseDto createNotification(Long recipientId, String message, String type, Long relatedPostId) {
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRelatedPostId(relatedPostId);
        notification.setRead(false); // Assuming 'read' is the field name based on your DTO

        notification = notificationRepository.save(notification);

        NotificationResponseDto dto = new NotificationResponseDto();
        dto.setId(notification.getId());
        dto.setRecipientId(notification.getRecipient().getId());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setRelatedPostId(notification.getRelatedPostId());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());

        return dto;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponseDto> getNotificationsByUser(Long recipientId) {
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Notification> notifications = notificationRepository.findByRecipient(recipient);
        return notifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NotificationResponseDto> getUnreadNotifications(Long recipientId) {
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Notification> notifications = notificationRepository.findByRecipientAndRead(recipient, false);
        return notifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationResponseDto markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setRead(true);
        notification = notificationRepository.save(notification);
        return convertToDto(notification);
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notificationRepository.delete(notification);
    }

    // Helper method to convert Notification entity to DTO
    private NotificationResponseDto convertToDto(Notification notification) {
        NotificationResponseDto dto = new NotificationResponseDto();
        dto.setId(notification.getId());
        dto.setRecipientId(notification.getRecipient().getId());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setRelatedPostId(notification.getRelatedPostId());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}