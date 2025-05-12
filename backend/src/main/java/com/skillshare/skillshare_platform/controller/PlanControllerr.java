package com.skillshare.skillshare_platform.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillshare.skillshare_platform.entity.Plann;
import com.skillshare.skillshare_platform.repository.PlanRepositoryy;

@RestController
@RequestMapping("/api/plans")
public class PlanControllerr {

    @Autowired
    private PlanRepositoryy planRepository;

    // CREATE a new plan
    @PostMapping
    public ResponseEntity<Plann> createPlan(@RequestBody Plann plan) {
        Plann savedPlan = planRepository.save(plan);
        return ResponseEntity.ok(savedPlan);
    }

    // READ all plans
    @GetMapping
    public List<Plann> getAllPlans() {
        return planRepository.findAll();
    }

    // READ a specific plan by ID
    @GetMapping("/{id}")
    public ResponseEntity<Plann> getPlanById(@PathVariable Long id) {
        Optional<Plann> plan = planRepository.findById(id);
        return plan.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // UPDATE an existing plan
    @PutMapping("/{id}")
    public ResponseEntity<Plann> updatePlan(@PathVariable Long id, @RequestBody Plann updatedPlan) {
        if (!planRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        updatedPlan.setId(id);
        return ResponseEntity.ok(planRepository.save(updatedPlan));
    }

    // DELETE a plan
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        if (!planRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        planRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
