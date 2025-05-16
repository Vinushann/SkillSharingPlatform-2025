package com.skillshare.skillshare_platform.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plann {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    private String mainTitle;

    // Subtopic 1
    private String sub1Name;
    private String sub1Duration;
    private String sub1Resource;
    private boolean sub1Completed;

    // Subtopic 2
    private String sub2Name;
    private String sub2Duration;
    private String sub2Resource;
    private boolean sub2Completed;

    // Subtopic 3
    private String sub3Name;
    private String sub3Duration;
    private String sub3Resource;
    private boolean sub3Completed;

    // Subtopic 4
    private String sub4Name;
    private String sub4Duration;
    private String sub4Resource;
    private boolean sub4Completed;


}
