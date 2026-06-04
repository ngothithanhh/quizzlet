package com.example.quizzlet.dto.assignment;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AssignmentResponse {
    private Long id;
    private String title;
    private String description;
    private Long classId;
    private Long testId;
    private String testTitle;
    private Long assignedById;
    private String assignedByName;
    private Integer timeLimit;
    private Integer maxAttempt;
    private Boolean allowReview;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    
    private Integer currentUserBestScore;
    private Integer currentUserAttemptCount;
}