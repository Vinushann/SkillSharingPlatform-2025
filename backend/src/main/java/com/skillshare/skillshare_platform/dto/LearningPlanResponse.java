package com.skillshare.skillshare_platform.dto;

import lombok.Data;
import java.util.List;

@Data
public class LearningPlanResponse {
    private Long id;
    private String title;
    private List<LearningSubTopicDTO> subTopics;
}