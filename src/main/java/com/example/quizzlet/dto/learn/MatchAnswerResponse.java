package com.example.quizzlet.dto.learn;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MatchAnswerResponse {
    private Boolean correct;

    private Integer matchedPairs;

    private Integer wrongAttempts;

    private Boolean completed;

    private Integer score;

}
