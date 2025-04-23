package com.skillshare.skillshare_platform.repository;

import com.skillshare.skillshare_platform.model.ProgressUpdate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgressUpdateRepository extends JpaRepository<ProgressUpdate, Long> {
    Page<ProgressUpdate> findByUserUserId(Long userId, Pageable pageable);
}