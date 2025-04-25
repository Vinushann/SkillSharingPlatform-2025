package com.skillshare.skillshare_platform.dto;

import lombok.Data;
import java.util.List;

@Data
public class LearningPlanResponse {
    // Add DTOs for LearningPlan request and response mappin
    private Long id;
    private String title;
    private List<LearningSubTopicDTO> subTopics;
}