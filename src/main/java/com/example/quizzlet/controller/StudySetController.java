package com.example.quizzlet.controller;

import com.example.quizzlet.dto.study.StudySetRequest;
import com.example.quizzlet.dto.study.StudySetResponse;
import com.example.quizzlet.dto.study.StudySetSimpleResponse;
import com.example.quizzlet.service.StudySetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/studysets")
@RequiredArgsConstructor
public class StudySetController {
    private final StudySetService studySetService;

    @PostMapping("/create")
    public ResponseEntity<StudySetResponse> create(@Valid @RequestBody StudySetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studySetService.create(request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<StudySetSimpleResponse>> getMyStudySets(){
        return ResponseEntity.ok(studySetService.getMyStudySets());
    }

    @GetMapping
    public ResponseEntity<List<StudySetSimpleResponse>> getAll(
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(studySetService.getAll(keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudySetResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(studySetService.getById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<StudySetResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody StudySetRequest request) {
        return ResponseEntity.ok(studySetService.update(id, request));
    }

    @PatchMapping("/{id}/visibility")
    public ResponseEntity<StudySetResponse> patchVisibility(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        Boolean isPublic = body.get("isPublic");
        if (isPublic == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(studySetService.setVisibility(id, isPublic));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studySetService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
