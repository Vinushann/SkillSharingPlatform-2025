package com.skillshare.skillshare_platform.repository;

import com.skillshare.skillshare_platform.entity.LearningPlan;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
    // Add repository for LearningPlan with method to fetch templates
    List<LearningPlan> findByIsTemplateTrue();

}