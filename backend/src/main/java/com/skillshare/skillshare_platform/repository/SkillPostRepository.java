package com.skillshare.skillshare_platform.repository;

import com.skillshare.skillshare_platform.model.SkillPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillPostRepository extends JpaRepository<SkillPost, Long> {
    Page<SkillPost> findByUserUserId(Long userId, Pageable pageable);
}