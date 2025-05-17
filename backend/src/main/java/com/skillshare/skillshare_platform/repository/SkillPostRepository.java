package com.skillshare.skillshare_platform.repository;

import com.skillshare.skillshare_platform.entity.SkillPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillPostRepository extends JpaRepository<SkillPost, Long> {
    List<SkillPost> findByUserId(Long userId);
}