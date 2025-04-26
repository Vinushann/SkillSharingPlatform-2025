package com.skillshare.skillshare_platform.service;

import com.skillshare.skillshare_platform.dto.PlanDTO;
import com.skillshare.skillshare_platform.dto.SubtopicDTO;
import com.skillshare.skillshare_platform.entity.Plan;
import com.skillshare.skillshare_platform.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlanService {

    @Autowired
    private PlanRepository planRepository;

    public Plan createPlan(Plan plan) {
        if (plan.getDuration() == null || plan.getDuration().isEmpty()) {
            int totalDays = plan.getSubtopics().stream()
                .mapToInt(subtopic -> {
                    try {
                        return Integer.parseInt(subtopic.getDuration().replaceAll("[^0-9]", ""));
                    } catch (NumberFormatException e) {
                        return 0;
                    }
                })
                .sum();
            plan.setDuration(totalDays + " days");
        }
        return planRepository.save(plan);
    }

    public List<PlanDTO> getAllPlans() {
        return planRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public Optional<PlanDTO> getPlanById(Long id) {
        return planRepository.findById(id)
            .map(this::convertToDTO);
    }

    private PlanDTO convertToDTO(Plan plan) {
        List<SubtopicDTO> subtopicDTOs = plan.getSubtopics().stream()
            .map(subtopic -> new SubtopicDTO(
                subtopic.getName(),
                subtopic.getDescription(),
                subtopic.getDuration(),
                subtopic.getResource(),
                subtopic.getGoals(),
                subtopic.getExercises(),
                subtopic.isCompleted()
            ))
            .collect(Collectors.toList());

        return new PlanDTO(
            plan.getId(),
            plan.getTitle(),
            plan.getDuration(),
            subtopicDTOs,
            plan.isTemplate(),
            plan.getCreatedAt()
        );
    }
}