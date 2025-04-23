package com.skillshare.skillshare_platform.service;

import com.skillshare.skillshare_platform.dto.LearningPlanRequestDto;
import com.skillshare.skillshare_platform.dto.LearningPlanResponseDto;
import com.skillshare.skillshare_platform.exception.ResourceConflictException;
import com.skillshare.skillshare_platform.exception.ResourceNotFoundException;
import com.skillshare.skillshare_platform.model.LearningPlan;
import com.skillshare.skillshare_platform.model.User;
import com.skillshare.skillshare_platform.repository.LearningPlanRepository;
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
public class LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;
    private final UserRepository userRepository;

    @Autowired
    public LearningPlanService(LearningPlanRepository learningPlanRepository, UserRepository userRepository) {
        this.learningPlanRepository = learningPlanRepository;
        this.userRepository = userRepository;
    }

    public LearningPlanResponseDto createLearningPlan(LearningPlanRequestDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));

        if (learningPlanRepository.existsByUserUserIdAndTitle(dto.getUserId(), dto.getTitle())) {
            throw new ResourceConflictException("Learning plan with title '" + dto.getTitle() + "' already exists for user");
        }

        LearningPlan plan = new LearningPlan();
        plan.setUser(user);
        plan.setTitle(dto.getTitle());
        plan.setDescription(dto.getDescription());
        plan.setTopics(dto.getTopics());
        plan.setResources(dto.getResources());
        plan.setStartDate(dto.getStartDate());
        plan.setEndDate(dto.getEndDate());
        plan.setTopicStatuses(dto.getTopicStatuses());

        LearningPlan savedPlan = learningPlanRepository.save(plan);
        return mapToResponseDto(savedPlan);
    }

    public LearningPlanResponseDto getLearningPlanById(Long id) {
        LearningPlan plan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found with ID: " + id));
        return mapToResponseDto(plan);
    }

    public LearningPlanResponseDto updateLearningPlan(Long id, LearningPlanRequestDto dto) {
        LearningPlan plan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found with ID: " + id));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));

        if (!plan.getTitle().equals(dto.getTitle()) &&
                learningPlanRepository.existsByUserUserIdAndTitle(dto.getUserId(), dto.getTitle())) {
            throw new ResourceConflictException("Learning plan with title '" + dto.getTitle() + "' already exists for user");
        }

        plan.setUser(user);
        plan.setTitle(dto.getTitle());
        plan.setDescription(dto.getDescription());
        plan.setTopics(dto.getTopics());
        plan.setResources(dto.getResources());
        plan.setStartDate(dto.getStartDate());
        plan.setEndDate(dto.getEndDate());
        plan.setTopicStatuses(dto.getTopicStatuses());

        LearningPlan updatedPlan = learningPlanRepository.save(plan);
        return mapToResponseDto(updatedPlan);
    }

    public void deleteLearningPlan(Long id) {
        if (!learningPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Learning plan not found with ID: " + id);
        }
        learningPlanRepository.deleteById(id);
    }

    public Map<String, Object> getAllLearningPlans(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<LearningPlan> planPage = learningPlanRepository.findAll(pageable);
        List<LearningPlanResponseDto> plans = planPage.getContent().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", plans);
        response.put("page", planPage.getNumber());
        response.put("size", planPage.getSize());
        response.put("totalElements", planPage.getTotalElements());
        response.put("totalPages", planPage.getTotalPages());
        return response;
    }

    public Map<String, Object> getLearningPlansByUserId(Long userId, int page, int size) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Pageable pageable = PageRequest.of(page, size);
        Page<LearningPlan> planPage = learningPlanRepository.findByUserUserId(userId, pageable);
        List<LearningPlanResponseDto> plans = planPage.getContent().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", plans);
        response.put("page", planPage.getNumber());
        response.put("size", planPage.getSize());
        response.put("totalElements", planPage.getTotalElements());
        response.put("totalPages", planPage.getTotalPages());
        return response;
    }

    private LearningPlanResponseDto mapToResponseDto(LearningPlan plan) {
        LearningPlanResponseDto responseDto = new LearningPlanResponseDto();
        responseDto.setPlanId(plan.getPlanId());
        responseDto.setUserId(plan.getUser().getUserId());
        responseDto.setUsername(plan.getUser().getUsername());
        responseDto.setTitle(plan.getTitle());
        responseDto.setDescription(plan.getDescription());
        responseDto.setTopics(plan.getTopics());
        responseDto.setResources(plan.getResources());
        responseDto.setStartDate(plan.getStartDate());
        responseDto.setEndDate(plan.getEndDate());
        responseDto.setTopicStatuses(plan.getTopicStatuses());
        responseDto.setCreatedAt(plan.getCreatedAt());
        responseDto.setUpdatedAt(plan.getUpdatedAt());
        return responseDto;
    }
}