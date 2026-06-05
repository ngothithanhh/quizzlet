package com.example.quizzlet.dto.history;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MatchHistoryResponse {
    private Long sessionId;
    private Long studySetId;
    private String studySetTitle;
    private Integer timeMs;
    private Integer score;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
