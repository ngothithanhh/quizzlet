package com.example.quizzlet.controller;

import com.example.quizzlet.dto.learn.LearnCardRequest;
import com.example.quizzlet.dto.learn.LearnCardResponse;
import com.example.quizzlet.service.LearnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/learn")
public class LearnController {
    private final LearnService learnService;

    @GetMapping("/{studySetId}")
    public ResponseEntity<List<LearnCardResponse>> getLearnCards(@PathVariable Long studySetId) {
        return ResponseEntity.ok(learnService.getCards(studySetId));
    }

    @PostMapping("/submit")
    public ResponseEntity<Void> submitLearnResult(@RequestBody LearnCardRequest request) {
        learnService.submit(request);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/{studySetId}/reset")
    public ResponseEntity<Void> resetProgress(@PathVariable Long studySetId) {
        learnService.resetProgress(studySetId);
        return ResponseEntity.ok().build();
    }
}
