package com.skillshare.skillshare_platform.repository;

import com.skillshare.skillshare_platform.entity.ProgressUpdate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgressUpdateRepository extends JpaRepository<ProgressUpdate, Long> {
    List<ProgressUpdate> findByUserId(Long userId);
}
