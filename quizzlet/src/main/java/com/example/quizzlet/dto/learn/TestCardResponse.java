package com.example.quizzlet.dto.learn;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TestCardResponse {
    private Long testId;
    private Long studysetId;
    private String title;
    private List<TestQuestionResponse> questions;
}
