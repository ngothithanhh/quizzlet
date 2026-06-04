package com.example.quizzlet.controller;

import com.example.quizzlet.dto.learn.MatchAnswerRequest;
import com.example.quizzlet.dto.learn.MatchAnswerResponse;
import com.example.quizzlet.dto.learn.MatchStartResponse;
import com.example.quizzlet.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/match")
@RequiredArgsConstructor
public class MatchController {
    private final MatchService matchService;

    @PostMapping("/start/{studySetId}")
    public MatchStartResponse start(@PathVariable Long studySetId){
        return matchService.startMatch(studySetId);
    }

    @PostMapping("/answer")
    public MatchAnswerResponse answer(@RequestBody MatchAnswerRequest request){
        return matchService.submitAnswer(request);
    }
}
