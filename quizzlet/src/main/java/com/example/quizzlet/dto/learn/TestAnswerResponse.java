package com.example.quizzlet.dto.learn;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TestAnswerResponse {
    private Long questionId;
    private String userAnswer;
    private String correctAnswer;
    private Boolean isCorrect;
}
