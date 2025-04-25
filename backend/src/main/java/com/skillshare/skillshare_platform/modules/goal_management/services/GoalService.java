package com.skillshare.skillshare_platform.modules.goal_management.services;

import com.skillshare.skillshare_platform.modules.goal_management.dtos.GoalDTOs;
import com.skillshare.skillshare_platform.modules.goal_management.models.Goal;
import com.skillshare.skillshare_platform.modules.goal_management.models.GoalStatus;
import com.skillshare.skillshare_platform.modules.goal_management.repositories.GoalRepository;
import com.skillshare.skillshare_platform.modules.user_management.models.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    // Create a new goal
    public GoalDTOs.GoalResponse createGoal(GoalDTOs.GoalRequest request, AppUser currentUser) {
        Goal goal = new Goal();
        goal.setDescription(request.getDescription());
        goal.setTargetDate(request.getTargetDate());
        goal.setUser(currentUser);
        goal.setStatus(GoalStatus.NOT_STARTED);
        goal.setCreatedAt(new Date());
        goal.setUpdatedAt(new Date());

        Goal savedGoal = goalRepository.save(goal);
        return mapToGoalResponse(savedGoal);
    }

    // Get all goals for a specific user
    public List<GoalDTOs.GoalResponse> getAllGoalsForUser(String userId) {
        List<Goal> goals = goalRepository.findByUserId(userId);
        return goals.stream()
                .map(this::mapToGoalResponse)
                .collect(Collectors.toList());
    }

    // Get a specific goal by ID
    public GoalDTOs.GoalResponse getGoalById(String goalId, String userId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new IllegalArgumentException("Goal not found"));
        if (!goal.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to view this goal");
        }
        return mapToGoalResponse(goal);
    }

    // Update a goal
    public GoalDTOs.GoalResponse updateGoal(String goalId, GoalDTOs.GoalRequest request, String userId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new IllegalArgumentException("Goal not found"));
        if (!goal.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to update this goal");
        }

        goal.setDescription(request.getDescription());
        goal.setTargetDate(request.getTargetDate());
        goal.setStatus(request.getStatus());
        goal.setUpdatedAt(new Date());

        Goal updatedGoal = goalRepository.save(goal);
        return mapToGoalResponse(updatedGoal);
    }

    // Delete a goal
    public void deleteGoal(String goalId, String userId) {
        if (!goalRepository.existsByIdAndUserId(goalId, userId)) {
            throw new IllegalArgumentException("Goal not found or you are not authorized to delete it");
        }
        goalRepository.deleteById(goalId);
    }

    // Map Goal entity to GoalResponse DTO
    private GoalDTOs.GoalResponse mapToGoalResponse(Goal goal) {
        GoalDTOs.GoalResponse response = new GoalDTOs.GoalResponse();
        response.setId(goal.getId());
        response.setDescription(goal.getDescription());
        response.setStatus(goal.getStatus());
        response.setTargetDate(goal.getTargetDate());
        response.setCreatedAt(goal.getCreatedAt());
        response.setUpdatedAt(goal.getUpdatedAt());

        GoalDTOs.UserSummaryDTO userSummary = new GoalDTOs.UserSummaryDTO();
        userSummary.setId(goal.getUser().getId());
        userSummary.setFirstName(goal.getUser().getFirstName());
        userSummary.setLastName(goal.getUser().getLastName());
        userSummary.setProfileImageUrl(goal.getUser().getProfileImageUrl());

        response.setUser(userSummary);
        return response;
    }
}