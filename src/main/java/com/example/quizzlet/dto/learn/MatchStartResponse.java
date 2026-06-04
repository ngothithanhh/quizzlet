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
public class MatchStartResponse {
    private Long sessionId;
    private Long matchSessionId;
    private Integer totalPairs;
    private List<MatchCardResponse> responses;
}
