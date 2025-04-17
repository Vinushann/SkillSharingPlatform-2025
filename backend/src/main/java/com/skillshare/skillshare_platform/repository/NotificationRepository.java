package com.skillshare.skillshare_platform.repository;

import com.skillshare.skillshare_platform.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Optional<Notification> findByUserUserIdAndTypeAndReferenceId(Long userId, String type, Long referenceId);
    Page<Notification> findByUserUserId(Long userId, Pageable pageable);
}