package com.skillshare.skillshare_platform.repository;

import com.skillshare.skillshare_platform.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByFollowerUserIdAndFollowedUserId(Long followerId, Long followedId);
}