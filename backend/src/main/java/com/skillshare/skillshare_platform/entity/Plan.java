package com.skillshare.skillshare_platform.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "plans")
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String duration;

    @ElementCollection
    @CollectionTable(name = "subtopics", joinColumns = @JoinColumn(name = "plan_id"))
    private List<Subtopic> subtopics;

    @Column(nullable = false)
    private boolean isTemplate = false;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public Plan() {}

    public Plan(String title, String duration, List<Subtopic> subtopics, boolean isTemplate) {
        this.title = title;
        this.duration = duration;
        this.subtopics = subtopics;
        this.isTemplate = isTemplate;
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

    public List<Subtopic> getSubtopics() {
        return subtopics;
    }

    public void setSubtopics(List<Subtopic> subtopics) {
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