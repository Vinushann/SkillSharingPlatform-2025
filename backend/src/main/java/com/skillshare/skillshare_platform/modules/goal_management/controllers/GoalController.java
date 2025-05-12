package com.skillshare.skillshare_platform.modules.goal_management.controllers;

import com.skillshare.skillshare_platform.modules.goal_management.dtos.GoalDTOs;
import com.skillshare.skillshare_platform.modules.goal_management.services.GoalService;
import com.skillshare.skillshare_platform.modules.user_management.models.AppUser;
import com.skillshare.skillshare_platform.modules.user_management.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/goals")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @Autowired
    private AppUserRepository userRepository;

    // Create a new goal
    @PostMapping("/{userId}")
    public ResponseEntity<GoalDTOs.GoalResponse> createGoal(
            @RequestBody GoalDTOs.GoalRequest request,
            @PathVariable String userId) {
        AppUser currentUser = userRepository.getById(userId);
        GoalDTOs.GoalResponse response = goalService.createGoal(request, currentUser);
        return ResponseEntity.ok(response);
    }

    // Get all goals for the current user
    @GetMapping("/{userId}")
    public ResponseEntity<List<GoalDTOs.GoalResponse>> getAllGoals(@PathVariable String userId) {

        List<GoalDTOs.GoalResponse> goals = goalService.getAllGoalsForUser(userId);
        return ResponseEntity.ok(goals);
    }

    // Get a specific goal by ID
    @GetMapping("/{goalId}/{userId}")
    public ResponseEntity<GoalDTOs.GoalResponse> getGoalById(
            @PathVariable String goalId,
            @PathVariable String userId) {

        GoalDTOs.GoalResponse response = goalService.getGoalById(goalId, userId);
        return ResponseEntity.ok(response);
    }

    // Update a goal
    @PutMapping("/{goalId}/{userId}")
    public ResponseEntity<GoalDTOs.GoalResponse> updateGoal(
            @PathVariable String goalId,
            @RequestBody GoalDTOs.GoalRequest request,
            @PathVariable String userId) {

        GoalDTOs.GoalResponse response = goalService.updateGoal(goalId, request, userId);
        return ResponseEntity.ok(response);
    }

    // Delete a goal
    @DeleteMapping("/{goalId}/{userId}")
    public ResponseEntity<String> deleteGoal(
            @PathVariable String goalId,
            @PathVariable String userId) {

        goalService.deleteGoal(goalId, userId);
        return ResponseEntity.ok("Goal deleted successfully.");
    }
}
