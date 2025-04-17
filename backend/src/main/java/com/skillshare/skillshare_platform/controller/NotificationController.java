package com.skillshare.skillshare_platform.controller;

import com.skillshare.skillshare_platform.dto.NotificationRequestDto;
import com.skillshare.skillshare_platform.dto.NotificationResponseDto;
import com.skillshare.skillshare_platform.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<NotificationResponseDto> createNotification(@Valid @RequestBody NotificationRequestDto dto) {
        NotificationResponseDto responseDto = notificationService.createNotification(dto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponseDto> getNotificationById(@PathVariable Long id) {
        NotificationResponseDto responseDto = notificationService.getNotificationById(id);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotificationResponseDto> updateNotification(@PathVariable Long id, @Valid @RequestBody NotificationRequestDto dto) {
        NotificationResponseDto responseDto = notificationService.updateNotification(id, dto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = notificationService.getAllNotifications(page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping(params = "userId")
    public ResponseEntity<Map<String, Object>> getNotificationsByUserId(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = notificationService.getNotificationsByUserId(userId, page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}