package com.skillshare.skillshare_platform.modules.post_management.repositories;

import com.skillshare.skillshare_platform.modules.post_management.models.UserPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<UserPost, String> {


    List<UserPost> findByPostedByIdOrderByPostedAtDesc(String userId);

    // Query to check if a post exists by ID
    boolean existsById(String postId);
}