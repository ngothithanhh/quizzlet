package com.example.quizzlet.dto.assignment;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AssignmentAttemptResponse {
    private Long id;
    private Integer attemptNumber;
    private Integer score;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
}
