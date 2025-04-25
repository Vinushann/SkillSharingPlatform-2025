package com.skillshare.skillshare_platform.modules.post_management.repositories;

import com.skillshare.skillshare_platform.modules.post_management.models.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {

    // Find all comments for a specific post, ordered by date (newest first)
    List<Comment> findByPostIdOrderByCommentedAtDesc(String postId);

    // Count comments for a post
    long countByPostId(String postId);

    // Find comments by user ID
    List<Comment> findByUserId(String userId);

    // Delete all comments for a post (useful when deleting a post)
    void deleteAllByPostId(String postId);

    // Custom query to get comment count for multiple posts at once
    @Query("SELECT c.post.id, COUNT(c) FROM Comment c WHERE c.post.id IN :postIds GROUP BY c.post.id")
    List<Object[]> countCommentsByPostIds(@Param("postIds") List<String> postIds);
}