package com.skillshare.skillshare_platform.service;

import com.skillshare.skillshare_platform.entity.LearningPlan;
import com.skillshare.skillshare_platform.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository repository;

    // Save a learning plan
    public LearningPlan savePlan(LearningPlan plan) {
        return repository.save(plan);
    }

    // Get all learning plans
    public List<LearningPlan> getAllPlans() {
        return repository.findAll();
    }
}