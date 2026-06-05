package com.example.quizzlet.dto.history;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class HistoryTestResponse {
    private Long attemptId;

    private Long testId;

    private Long studySetId;

    private String studySetTitle;

    private Integer score;

    private LocalDateTime submittedAt;
}
