package com.example.quizzlet.controller;

import com.example.quizzlet.dto.history.LearnHistoryResponse;
import com.example.quizzlet.dto.history.MatchHistoryResponse;
import com.example.quizzlet.dto.history.TestHistoryResponse;
import com.example.quizzlet.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping("/tests")
    public ResponseEntity<List<TestHistoryResponse>> getTestHistory() {
        return ResponseEntity.ok(historyService.getTestHistory());
    }

    @GetMapping("/learns")
    public ResponseEntity<List<LearnHistoryResponse>> getLearnHistory() {
        return ResponseEntity.ok(historyService.getLearnHistory());
    }

    @GetMapping("/matches")
    public ResponseEntity<List<MatchHistoryResponse>> getMatchHistory() {
        return ResponseEntity.ok(historyService.getMatchHistory());
    }
}