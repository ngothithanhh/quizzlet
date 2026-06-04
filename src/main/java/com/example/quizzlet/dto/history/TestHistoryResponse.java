package com.example.quizzlet.dto.history;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TestHistoryResponse {
    private Long attemptId;
    private Long studySetId;
    private String studySetTitle;
    private Integer score;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
}
