package com.skillshare.skillshare_platform.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PlanDTO {

    private Long id;
    private String title;
    private String duration;
    private List<SubtopicDTO> subtopics;
    private boolean isTemplate;
    private LocalDateTime createdAt;

    // Constructors
    public PlanDTO() {}

    public PlanDTO(Long id, String title, String duration, List<SubtopicDTO> subtopics, boolean isTemplate, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.duration = duration;
        this.subtopics = subtopics;
        this.isTemplate = isTemplate;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public List<SubtopicDTO> getSubtopics() {
        return subtopics;
    }

    public void setSubtopics(List<SubtopicDTO> subtopics) {
        this.subtopics = subtopics;
    }

    public boolean isTemplate() {
        return isTemplate;
    }

    public void setTemplate(boolean isTemplate) {
        this.isTemplate = isTemplate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}