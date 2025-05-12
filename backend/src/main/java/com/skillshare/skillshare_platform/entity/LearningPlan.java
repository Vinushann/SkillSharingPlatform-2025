package com.skillshare.skillshare_platform.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "learning_plans")
public class LearningPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String planTitle;
    private String subtopicName;
    private String description;
    private String duration;
    private String resources;
    private String goals;
    private String exercises;
    private Boolean markAsCompleted;

    // Default constructor
    public LearningPlan() {
    }

    // Parameterized constructor
    public LearningPlan(String planTitle, String subtopicName, String description, String duration,
                        String resources, String goals, String exercises, Boolean markAsCompleted) {
        this.planTitle = planTitle;
        this.subtopicName = subtopicName;
        this.description = description;
        this.duration = duration;
        this.resources = resources;
        this.goals = goals;
        this.exercises = exercises;
        this.markAsCompleted = markAsCompleted;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlanTitle() {
        return planTitle;
    }

    public void setPlanTitle(String planTitle) {
        this.planTitle = planTitle;
    }

    public String getSubtopicName() {
        return subtopicName;
    }

    public void setSubtopicName(String subtopicName) {
        this.subtopicName = subtopicName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getResources() {
        return resources;
    }

    public void setResources(String resources) {
        this.resources = resources;
    }

    public String getGoals() {
        return goals;
    }

    public void setGoals(String goals) {
        this.goals = goals;
    }

    public String getExercises() {
        return exercises;
    }

    public void setExercises(String exercises) {
        this.exercises = exercises;
    }

    public Boolean getMarkAsCompleted() {
        return markAsCompleted;
    }

    public void setMarkAsCompleted(Boolean markAsCompleted) {
        this.markAsCompleted = markAsCompleted;
    }
}