package com.skillshare.skillshare_platform.repository;

import com.skillshare.skillshare_platform.model.LearningPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
    Page<LearningPlan> findByUserUserId(Long userId, Pageable pageable);
    boolean existsByUserUserIdAndTitle(Long userId, String title);
}