package com.skillshare.skillshare_platform.dto;

import lombok.Data;
import java.util.List;

@Data
public class LearningPlanRequest {
    private String title;
    private List<LearningSubTopicDTO> subTopics;
} 