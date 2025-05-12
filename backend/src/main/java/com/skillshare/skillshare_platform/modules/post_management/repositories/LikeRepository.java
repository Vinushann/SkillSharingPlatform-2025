package com.skillshare.skillshare_platform.modules.post_management.repositories;

import com.skillshare.skillshare_platform.modules.post_management.models.Like;
import com.skillshare.skillshare_platform.modules.user_management.models.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, String> {

    // Find all likes for a specific post
    List<Like> findByPostId(String postId);

    // Count likes for a post
    long countByPostId(String postId);

    // Check if a user has liked a specific post
    boolean existsByPostIdAndUserId(String postId, String userId);

    // Find a specific like by post and user
    Optional<Like> findByPostIdAndUserId(String postId, String userId);

    // Delete all likes for a post (useful when deleting a post)
    void deleteAllByPostId(String postId);

    // Delete a specific like by post and user
    void deleteByPostIdAndUserId(String postId, String userId);
}