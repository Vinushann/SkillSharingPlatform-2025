package com.skillshare.skillshare_platform.repository;


import com.skillshare.skillshare_platform.entity.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
}