package com.skillshare.skillshare_platform.repository;

import com.skillshare.skillshare_platform.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
}