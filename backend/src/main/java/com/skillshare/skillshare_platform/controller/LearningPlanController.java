package com.skillshare.skillshare_platform.controller;

import com.skillshare.skillshare_platform.dto.LearningPlanRequest;
import com.skillshare.skillshare_platform.dto.LearningPlanResponse;
import com.skillshare.skillshare_platform.entity.LearningPlan;
import com.skillshare.skillshare_platform.service.LearningPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/learning-plans")
@RequiredArgsConstructor
public class LearningPlanController {
    //Create LearningPlanController with POST and GET endpoints

    private final LearningPlanService service;

    @PostMapping
    public ResponseEntity<LearningPlan> createPlan(@RequestBody LearningPlanRequest request) {
        LearningPlan saved = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<LearningPlanResponse>> getAllPlans() {
        return ResponseEntity.ok(service.getAllAsDto());
    }
    @GetMapping("/templates")
    public ResponseEntity<List<LearningPlanResponse>> getTemplates() {
        return ResponseEntity.ok(service.getAllTemplates());
    }

}