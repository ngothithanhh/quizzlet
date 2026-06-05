package com.example.quizzlet.dto.learn;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestOptionResponse {
    private Long id;

    private String optionText;

    private Boolean isCorrect;
}
