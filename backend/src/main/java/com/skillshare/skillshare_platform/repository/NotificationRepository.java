// src/main/java/com/skillshare/skillshare_platform/repository/NotificationRepository.java
package com.skillshare.skillshare_platform.repository;

import com.skillshare.skillshare_platform.entity.Notification;
import com.skillshare.skillshare_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipient(User recipient);
    List<Notification> findByRecipientAndRead(User recipient, Boolean read);
}
