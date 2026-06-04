package com.example.quizzlet.dto.history;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LearnHistoryResponse {
    private Long attemptId;
    private Long studySetId;
    private String studySetTitle;
    private String result;
    private Integer responseTime;
    private LocalDateTime studiedAt;
}
