package com.skillshare.skillshare_platform.model;

import java.util.Arrays;
import java.util.List;

public class ProgressTemplate {

    public static final String COMPLETED_TUTORIAL = "COMPLETED_TUTORIAL";
    public static final String NEW_SKILL = "NEW_SKILL";
    public static final String MILESTONE = "MILESTONE";

    public static List<String> getTemplates() {
        return Arrays.asList(COMPLETED_TUTORIAL, NEW_SKILL, MILESTONE);
    }

    public static List<String> getFields(String templateType) {
        switch (templateType) {
            case COMPLETED_TUTORIAL:
                return Arrays.asList("tutorialName", "hoursSpent", "keyTakeaway");
            case NEW_SKILL:
                return Arrays.asList("skillName", "description", "confidenceLevel");
            case MILESTONE:
                return Arrays.asList("achievement", "dateAchieved", "notes");
            default:
                return Arrays.asList();
        }
    }
}