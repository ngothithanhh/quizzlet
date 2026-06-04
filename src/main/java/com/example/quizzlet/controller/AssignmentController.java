package com.example.quizzlet.controller;

import com.example.quizzlet.dto.assignment.AssignmentRequest;
import com.example.quizzlet.dto.assignment.AssignmentResponse;
import com.example.quizzlet.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {
    private final AssignmentService assignmentService;

    @PostMapping("/create/{classId}")
    public ResponseEntity<AssignmentResponse> create(@PathVariable Long classId, @RequestBody AssignmentRequest request){
        return ResponseEntity.ok(assignmentService.createAssignment(classId,request));
    }

    @GetMapping("/get-assignments/{classId}")
    public ResponseEntity<List<AssignmentResponse>> getClassAssignments(@PathVariable Long classId){
        return ResponseEntity.ok(assignmentService.getClassAssignments(classId));
    }

    @GetMapping("/assignments/{assignmentId}")
    public ResponseEntity<AssignmentResponse> getAssignmentDetail(@PathVariable("assignmentId") Long assignmentId) {
        return ResponseEntity.ok(assignmentService.getAssignmentDetail(assignmentId));
    }

    @DeleteMapping("/assignments/{assignmentId}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable("assignmentId") Long assignmentId) {
        assignmentService.deleteAssignment(assignmentId);
        return ResponseEntity.noContent().build();
    }
}
