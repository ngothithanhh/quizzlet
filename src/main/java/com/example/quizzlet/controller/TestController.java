package com.example.quizzlet.controller;

import com.example.quizzlet.dto.learn.CreateTestRequest;
import com.example.quizzlet.dto.learn.TestCardResponse;
import com.example.quizzlet.dto.learn.TestResultResponse;
import com.example.quizzlet.dto.learn.TestSubmitRequest;
import com.example.quizzlet.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/test")
public class TestController {
    private final TestService testService;

    @PostMapping("/generate")
    public ResponseEntity<TestCardResponse> generateTest(@RequestBody CreateTestRequest request) {
        return ResponseEntity.ok(testService.generate(request));
    }

    @PostMapping("/submit")
    public ResponseEntity<TestResultResponse> submitTest(@RequestBody TestSubmitRequest request) {
        return ResponseEntity.ok(testService.submit(request));
    }
}
