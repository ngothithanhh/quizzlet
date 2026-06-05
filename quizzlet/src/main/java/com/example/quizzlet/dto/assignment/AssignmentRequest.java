package com.example.quizzlet.dto.assignment;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AssignmentRequest {
    private String title;
    private String description;
    private Long testId;
    private Integer timeLimit;
    private Integer maxAttempt;
    private Boolean allowReview;
    private LocalDateTime dueDate;
}