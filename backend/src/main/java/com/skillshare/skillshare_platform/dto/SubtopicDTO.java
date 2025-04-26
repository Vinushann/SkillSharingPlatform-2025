package com.skillshare.skillshare_platform.dto;

public class SubtopicDTO {

    private String name;
    private String description;
    private String duration;
    private String resource;
    private String goals;
    private String exercises;
    private boolean completed;

    // Constructors
    public SubtopicDTO() {}

    public SubtopicDTO(String name, String description, String duration, String resource, String goals, String exercises, boolean completed) {
        this.name = name;
        this.description = description;
        this.duration = duration;
        this.resource = resource;
        this.goals = goals;
        this.exercises = exercises;
        this.completed = completed;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getResource() {
        return resource;
    }

    public void setResource(String resource) {
        this.resource = resource;
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

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}