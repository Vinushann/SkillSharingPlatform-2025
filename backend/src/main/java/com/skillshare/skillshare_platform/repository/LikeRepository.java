package com.skillshare.skillshare_platform.repository;

import com.skillshare.skillshare_platform.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserIdAndSkillPostId(Long userId, Long skillPostId);
    long countBySkillPostId(Long skillPostId);
}
