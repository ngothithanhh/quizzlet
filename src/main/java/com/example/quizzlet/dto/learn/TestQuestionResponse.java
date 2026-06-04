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
public class TestQuestionResponse {
    private Long id;
    private Long flashcardId;
    private String question;
    private String correctAnswer;
    private List<TestOptionResponse> options;
}
