package com.skillshare.skillshare_platform.repository;

import com.skillshare.skillshare_platform.entity.LearningSubTopic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningSubTopicRepository extends JpaRepository<LearningSubTopic, Long> {
}