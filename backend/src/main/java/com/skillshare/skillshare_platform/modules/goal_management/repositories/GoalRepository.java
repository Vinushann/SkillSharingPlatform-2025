package com.skillshare.skillshare_platform.modules.goal_management.repositories;

import com.skillshare.skillshare_platform.modules.goal_management.models.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, String> {

    // Find all goals for a specific user
    List<Goal> findByUserId(String userId);

    // Find a specific goal by ID and user ID
    boolean existsByIdAndUserId(String goalId, String userId);

    // Delete a specific goal by ID and user ID
    void deleteByIdAndUserId(String goalId, String userId);
}