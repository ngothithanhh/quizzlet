package com.example.quizzlet.controller;

import com.example.quizzlet.dto.assignment.AssignmentStartResponse;
import com.example.quizzlet.dto.assignment.AssignmentSubmissionResponse;
import com.example.quizzlet.dto.assignment.AssignmentSubmitRequest;
import com.example.quizzlet.dto.learn.TestResultResponse;
import com.example.quizzlet.service.AssignmentWorkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentWorkController {
    private final AssignmentWorkService assignmentWorkService;

    @PostMapping("/{assignmentId}/start")
    public ResponseEntity<AssignmentStartResponse> start(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(assignmentWorkService.startAssignment(assignmentId));
    }

    @PostMapping("/{assignmentId}/submit")
    public ResponseEntity<TestResultResponse> submit(@PathVariable Long assignmentId, @RequestBody AssignmentSubmitRequest request) {
        return ResponseEntity.ok(assignmentWorkService.submitAssignment(assignmentId, request));
    }

    @GetMapping("/{assignmentId}/my-result")
    public ResponseEntity<AssignmentSubmissionResponse> myResult(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(assignmentWorkService.getMyResult(assignmentId));
    }
}
