package com.example.quizzlet.service;

import com.example.quizzlet.dto.learn.MatchAnswerRequest;
import com.example.quizzlet.dto.learn.MatchAnswerResponse;
import com.example.quizzlet.dto.learn.MatchStartResponse;

public interface MatchService {
    MatchStartResponse startMatch(Long studySetId);

    MatchAnswerResponse submitAnswer(MatchAnswerRequest request);
}
