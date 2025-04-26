
package com.skillshare.skillshare_platform.controller;

import com.skillshare.skillshare_platform.entity.LearningPlan;
import com.skillshare.skillshare_platform.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin(origins = "http://localhost:3000") // Allow CORS for frontend
public class LearningPlanController {

    @Autowired
    private LearningPlanService service;

    // POST endpoint to save a learning plan
    @PostMapping
    public ResponseEntity<LearningPlan> savePlan(@RequestBody LearningPlan plan) {
        LearningPlan savedPlan = service.savePlan(plan);
        return ResponseEntity.ok(savedPlan);
    }

    // GET endpoint to retrieve all learning plans
    @GetMapping
    public ResponseEntity<List<LearningPlan>> getAllPlans() {
        List<LearningPlan> plans = service.getAllPlans();
        return ResponseEntity.ok(plans);
    }
}