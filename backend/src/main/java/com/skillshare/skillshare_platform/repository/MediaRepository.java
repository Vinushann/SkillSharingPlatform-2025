package com.skillshare.skillshare_platform.repository;

import com.skillshare.skillshare_platform.model.Media;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
    Optional<Media> findByPostPostIdAndUrl(Long postId, String url);
    Page<Media> findByPostPostId(Long postId, Pageable pageable);
    long countByPostPostId(Long postId);
}