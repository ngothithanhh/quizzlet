package com.example.quizzlet.dto.learn;

import lombok.Data;

@Data
public class CreateTestRequest {
    private Long studySetId;
    private Integer timeLimit;
    private Integer maxAttempt;
    private Boolean showAnswer;
}
