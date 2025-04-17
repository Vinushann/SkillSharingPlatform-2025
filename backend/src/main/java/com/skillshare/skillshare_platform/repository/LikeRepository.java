package com.skillshare.skillshare_platform.repository;

import com.skillshare.skillshare_platform.model.Like;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserUserIdAndPostPostId(Long userId, Long postId);
    Page<Like> findByPostPostId(Long postId, Pageable pageable);
}