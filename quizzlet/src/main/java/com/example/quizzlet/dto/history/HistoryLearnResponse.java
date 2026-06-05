package com.example.quizzlet.dto.history;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class HistoryLearnResponse {
    private Long studySetId;

    private String studySetTitle;

    private Integer totalLearned;

    private LocalDateTime lastStudiedAt;
}
