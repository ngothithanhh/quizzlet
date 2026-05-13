package com.example.quizzlet.dto.learn;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Iterator;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchAnswerRequest {
    private Long matchSessionId;

    private Long flashcardId;

    private String selectedTerm;

    private String selectedDefinition;
}
