package com.skillshare.skillshare_platform.service;

import com.skillshare.skillshare_platform.dto.LearningPlanRequest;
import com.skillshare.skillshare_platform.dto.LearningPlanResponse;
import com.skillshare.skillshare_platform.dto.LearningSubTopicDTO;
import com.skillshare.skillshare_platform.entity.LearningPlan;
import com.skillshare.skillshare_platform.entity.LearningSubTopic;
import com.skillshare.skillshare_platform.repository.LearningPlanRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;

    public LearningPlan create(LearningPlanRequest request) {
        LearningPlan plan = new LearningPlan();
        plan.setTitle(request.getTitle());

        List<LearningSubTopic> subTopics = request.getSubTopics().stream().map(dto -> {
            LearningSubTopic sub = new LearningSubTopic();
            sub.setName(dto.getName());
            sub.setDescription(dto.getDescription());
            sub.setDuration(dto.getDuration());
            sub.setResource(dto.getResource());
            sub.setLearningPlan(plan);
            return sub;
        }).collect(Collectors.toList());

        plan.setSubTopics(subTopics);
        return learningPlanRepository.save(plan);
    }

    public List<LearningPlan> getAll() {
        return learningPlanRepository.findAll();
    }

    public List<LearningPlanResponse> getAllAsDto() {
        return learningPlanRepository.findAll().stream().map(plan -> {
            LearningPlanResponse res = new LearningPlanResponse();
            res.setId(plan.getId());
            res.setTitle(plan.getTitle());

            List<LearningSubTopicDTO> subDtos = plan.getSubTopics().stream().map(sub -> {
                LearningSubTopicDTO dto = new LearningSubTopicDTO();
                dto.setName(sub.getName());
                dto.setDescription(sub.getDescription());
                dto.setDuration(sub.getDuration());
                dto.setResource(sub.getResource());
                return dto;
            }).toList();

            res.setSubTopics(subDtos);
            return res;
        }).toList();
    }
    public List<LearningPlanResponse> getAllTemplates() {
        return learningPlanRepository.findByIsTemplateTrue().stream()
            .map(this::mapToDto)
            .toList();
    }
    
    private LearningPlanResponse mapToDto(LearningPlan plan) {
        LearningPlanResponse dto = new LearningPlanResponse();
        dto.setId(plan.getId());
        dto.setTitle(plan.getTitle());
    
        List<LearningSubTopicDTO> subDtos = plan.getSubTopics().stream().map(sub -> {
            LearningSubTopicDTO subDto = new LearningSubTopicDTO();
            subDto.setName(sub.getName());
            subDto.setDescription(sub.getDescription());
            subDto.setDuration(sub.getDuration());
            subDto.setResource(sub.getResource());
            return subDto;
        }).toList();
    
        dto.setSubTopics(subDtos);
        return dto;
    }
    
}