package com.skillshare.skillshare_platform.dto;

import lombok.Data;

@Data
public class LearningSubTopicDTO {
    // Add DTOs for LearningPlan request and response mappin
    private String name;
    private String description;
    private int duration;
    private String resource;
}