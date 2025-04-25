package com.skillshare.skillshare_platform.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

// the entity file
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @OneToMany(mappedBy = "learningPlan", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<LearningSubTopic> subTopics = new ArrayList<>();
    private boolean isTemplate;
    
}