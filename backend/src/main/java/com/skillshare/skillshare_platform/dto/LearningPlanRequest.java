package com.skillshare.skillshare_platform.dto;

import lombok.Data;
import java.util.List;

@Data
public class LearningPlanRequest {
    // Add DTOs for LearningPlan request and response mappin
    private String title;
    private List<LearningSubTopicDTO> subTopics;
} 