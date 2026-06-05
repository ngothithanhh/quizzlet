package com.example.quizzlet.service;

import com.example.quizzlet.dto.assignment.AssignmentStartResponse;
import com.example.quizzlet.dto.assignment.AssignmentSubmissionResponse;
import com.example.quizzlet.dto.assignment.AssignmentSubmitRequest;
import com.example.quizzlet.dto.learn.TestResultResponse;

public interface AssignmentWorkService {
    AssignmentStartResponse startAssignment(Long assignmentId);

    TestResultResponse submitAssignment(Long assignmentId, AssignmentSubmitRequest request);

    AssignmentSubmissionResponse getMyResult(Long assignmentId);
}
