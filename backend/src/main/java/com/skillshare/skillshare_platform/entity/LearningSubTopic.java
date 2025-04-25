package com.skillshare.skillshare_platform.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningSubTopic {
// Add LearningSubTopic entity with name, description, duration, resource, and FK to LearningPlan
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private int duration;
    private String resource;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learning_plan_id")
    @JsonBackReference
    private LearningPlan learningPlan;
}