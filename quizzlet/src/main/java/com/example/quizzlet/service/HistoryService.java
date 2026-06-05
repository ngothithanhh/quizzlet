package com.example.quizzlet.service;

import com.example.quizzlet.dto.history.LearnHistoryResponse;
import com.example.quizzlet.dto.history.MatchHistoryResponse;
import com.example.quizzlet.dto.history.TestHistoryResponse;

import java.util.List;

public interface HistoryService {
    List<TestHistoryResponse> getTestHistory();
    List<LearnHistoryResponse> getLearnHistory();
    List<MatchHistoryResponse> getMatchHistory();
}
