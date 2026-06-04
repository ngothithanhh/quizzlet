package com.example.quizzlet.mapper;

import com.example.quizzlet.dto.assignment.AssignmentResponse;
import com.example.quizzlet.entity.Assignment;

public class AssignmentMapper {
    public static AssignmentResponse toResponse(Assignment assignment){
        return AssignmentResponse.builder()
                .id(assignment.getId())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .classId(assignment.getClassroom().getId())
                .testId(assignment.getTest().getId())
                .testTitle(assignment.getTest().getTitle())
                .assignedById(assignment.getAssignedBy().getId())
                .assignedByName(assignment.getAssignedBy().getUsername())
                .timeLimit(assignment.getTimeLimit())
                .maxAttempt(assignment.getMaxAttempt())
                .allowReview(assignment.getAllowReview())
                .dueDate(assignment.getDueDate())
                .createdAt(assignment.getCreatedAt())
                .build();

    }
}
