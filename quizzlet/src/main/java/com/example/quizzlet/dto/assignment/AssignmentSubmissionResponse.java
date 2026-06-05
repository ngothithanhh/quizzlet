package com.example.quizzlet.dto.assignment;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AssignmentSubmissionResponse {
    private Long assignmentId;
    private Long userId;
    private Integer bestScore;
    private Integer attemptCount;
    private Integer maxAttempt;
    private String status;
    private LocalDateTime completedAt;
    private List<AssignmentAttemptResponse> attempts;
}
