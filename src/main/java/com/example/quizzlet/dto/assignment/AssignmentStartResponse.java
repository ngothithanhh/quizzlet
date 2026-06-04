package com.example.quizzlet.dto.assignment;

import com.example.quizzlet.dto.learn.TestCardResponse;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AssignmentStartResponse {
    private Long assignmentId;
    private Long testId;
    private String title;
    private Integer timeLimit;
    private LocalDateTime dueDate;
    private TestCardResponse test;
}
