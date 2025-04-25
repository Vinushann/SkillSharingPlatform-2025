package com.skillshare.skillshare_platform.dto;

import lombok.Data;

@Data
public class LearningSubTopicDTO {
    private String name;
    private String description;
    private int duration;
    private String resource;
}