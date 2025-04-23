package com.skillshare.skillshare_platform.service;

import com.skillshare.skillshare_platform.dto.ProgressUpdateRequestDto;
import com.skillshare.skillshare_platform.dto.ProgressUpdateResponseDto;
import com.skillshare.skillshare_platform.exception.ResourceNotFoundException;
import com.skillshare.skillshare_platform.model.ProgressTemplate;
import com.skillshare.skillshare_platform.model.ProgressUpdate;
import com.skillshare.skillshare_platform.model.User;
import com.skillshare.skillshare_platform.repository.ProgressUpdateRepository;
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
public class ProgressUpdateService {

    private final ProgressUpdateRepository progressUpdateRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProgressUpdateService(ProgressUpdateRepository progressUpdateRepository, UserRepository userRepository) {
        this.progressUpdateRepository = progressUpdateRepository;
        this.userRepository = userRepository;
    }

    public ProgressUpdateResponseDto createProgressUpdate(ProgressUpdateRequestDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));

        if (!ProgressTemplate.getTemplates().contains(dto.getTemplateType())) {
            throw new IllegalArgumentException("Invalid template type: " + dto.getTemplateType());
        }

        ProgressUpdate update = new ProgressUpdate();
        update.setUser(user);
        update.setTemplateType(dto.getTemplateType());
        update.setDetails(dto.getDetails());

        ProgressUpdate savedUpdate = progressUpdateRepository.save(update);
        return mapToResponseDto(savedUpdate);
    }

    public ProgressUpdateResponseDto getProgressUpdateById(Long id) {
        ProgressUpdate update = progressUpdateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Progress update not found with ID: " + id));
        return mapToResponseDto(update);
    }

    public ProgressUpdateResponseDto updateProgressUpdate(Long id, ProgressUpdateRequestDto dto) {
        ProgressUpdate update = progressUpdateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Progress update not found with ID: " + id));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));

        if (!ProgressTemplate.getTemplates().contains(dto.getTemplateType())) {
            throw new IllegalArgumentException("Invalid template type: " + dto.getTemplateType());
        }

        update.setUser(user);
        update.setTemplateType(dto.getTemplateType());
        update.setDetails(dto.getDetails());

        ProgressUpdate updatedUpdate = progressUpdateRepository.save(update);
        return mapToResponseDto(updatedUpdate);
    }

    public void deleteProgressUpdate(Long id) {
        if (!progressUpdateRepository.existsById(id)) {
            throw new ResourceNotFoundException("Progress update not found with ID: " + id);
        }
        progressUpdateRepository.deleteById(id);
    }

    public Map<String, Object> getAllProgressUpdates(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProgressUpdate> updatePage = progressUpdateRepository.findAll(pageable);
        List<ProgressUpdateResponseDto> updates = updatePage.getContent().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", updates);
        response.put("page", updatePage.getNumber());
        response.put("size", updatePage.getSize());
        response.put("totalElements", updatePage.getTotalElements());
        response.put("totalPages", updatePage.getTotalPages());
        return response;
    }

    public Map<String, Object> getProgressUpdatesByUserId(Long userId, int page, int size) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Pageable pageable = PageRequest.of(page, size);
        Page<ProgressUpdate> updatePage = progressUpdateRepository.findByUserUserId(userId, pageable);
        List<ProgressUpdateResponseDto> updates = updatePage.getContent().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", updates);
        response.put("page", updatePage.getNumber());
        response.put("size", updatePage.getSize());
        response.put("totalElements", updatePage.getTotalElements());
        response.put("totalPages", updatePage.getTotalPages());
        return response;
    }

    public List<String> getTemplateTypes() {
        return ProgressTemplate.getTemplates();
    }

    public List<String> getTemplateFields(String templateType) {
        return ProgressTemplate.getFields(templateType);
    }

    private ProgressUpdateResponseDto mapToResponseDto(ProgressUpdate update) {
        ProgressUpdateResponseDto responseDto = new ProgressUpdateResponseDto();
        responseDto.setUpdateId(update.getUpdateId());
        responseDto.setUserId(update.getUser().getUserId());
        responseDto.setUsername(update.getUser().getUsername());
        responseDto.setTemplateType(update.getTemplateType());
        responseDto.setDetails(update.getDetails());
        responseDto.setCreatedAt(update.getCreatedAt());
        responseDto.setUpdatedAt(update.getUpdatedAt());
        return responseDto;
    }
}