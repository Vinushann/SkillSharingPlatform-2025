package com.skillshare.skillshare_platform.controller;

import com.skillshare.skillshare_platform.dto.LearningPlanRequestDto;
import com.skillshare.skillshare_platform.dto.LearningPlanResponseDto;
import com.skillshare.skillshare_platform.service.LearningPlanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/learning-plans")
public class LearningPlanController {

    private final LearningPlanService learningPlanService;

    @Autowired
    public LearningPlanController(LearningPlanService learningPlanService) {
        this.learningPlanService = learningPlanService;
    }

    @PostMapping
    public ResponseEntity<LearningPlanResponseDto> createLearningPlan(@Valid @RequestBody LearningPlanRequestDto requestDto) {
        LearningPlanResponseDto responseDto = learningPlanService.createLearningPlan(requestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlanResponseDto> getLearningPlanById(@PathVariable Long id) {
        LearningPlanResponseDto responseDto = learningPlanService.getLearningPlanById(id);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlanResponseDto> updateLearningPlan(@PathVariable Long id, @Valid @RequestBody LearningPlanRequestDto requestDto) {
        LearningPlanResponseDto responseDto = learningPlanService.updateLearningPlan(id, requestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable Long id) {
        learningPlanService.deleteLearningPlan(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllLearningPlans(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = learningPlanService.getAllLearningPlans(page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping(params = "userId")
    public ResponseEntity<Map<String, Object>> getLearningPlansByUserId(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = learningPlanService.getLearningPlansByUserId(userId, page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}