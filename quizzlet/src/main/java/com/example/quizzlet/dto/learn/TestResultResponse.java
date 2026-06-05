package com.example.quizzlet.dto.learn;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestResultResponse {
    private Long attemptId;
    private Integer score;
    private Integer totalQuestions;
    private Integer correctAnswersCount;
    private List<TestAnswerResponse> results;
}
