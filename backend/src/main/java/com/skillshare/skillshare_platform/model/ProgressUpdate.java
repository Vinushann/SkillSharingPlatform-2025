package com.skillshare.skillshare_platform.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "progress_updates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProgressUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "update_id")
    private Long updateId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "template_type", nullable = false)
    private String templateType; // e.g., "COMPLETED_TUTORIAL", "NEW_SKILL"

    @Column(name = "details", columnDefinition = "TEXT", nullable = false)
    private String details; // JSON or text, e.g., "Tutorial: Python Basics, Hours: 3"

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}