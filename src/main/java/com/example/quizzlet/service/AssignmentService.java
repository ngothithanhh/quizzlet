package com.example.quizzlet.service;

import com.example.quizzlet.dto.assignment.AssignmentRequest;
import com.example.quizzlet.dto.assignment.AssignmentResponse;

import java.util.List;

public interface AssignmentService {
    AssignmentResponse createAssignment(Long classId, AssignmentRequest request);

    List<AssignmentResponse> getClassAssignments(Long classId);

    AssignmentResponse getAssignmentDetail(Long assignmentId);

    void deleteAssignment(Long assignmentId);
}