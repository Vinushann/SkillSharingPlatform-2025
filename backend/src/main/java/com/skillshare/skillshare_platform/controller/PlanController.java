package com.skillshare.skillshare_platform.controller;

import com.skillshare.skillshare_platform.dto.PlanDTO;
import com.skillshare.skillshare_platform.entity.Plan;
import com.skillshare.skillshare_platform.service.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class PlanController {

    @Autowired
    private PlanService planService;

    @PostMapping
    public ResponseEntity<Plan> createPlan(@RequestBody Plan plan) {
        if (plan.getTitle() == null || plan.getSubtopics() == null || plan.getSubtopics().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Plan savedPlan = planService.createPlan(plan);
        return ResponseEntity.status(201).body(savedPlan);
    }

    @GetMapping
    public ResponseEntity<List<PlanDTO>> getAllPlans() {
        List<PlanDTO> plans = planService.getAllPlans();
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanDTO> getPlanById(@PathVariable Long id) {
        return planService.getPlanById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}