package com.skillshare.skillshare_platform.repository;

import com.skillshare.skillshare_platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
