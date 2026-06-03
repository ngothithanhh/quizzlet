package com.example.quizzlet.controller;


import com.example.quizzlet.dto.classroom.ClassMemberResponse;
import com.example.quizzlet.dto.classroom.ClassroomRequest;
import com.example.quizzlet.dto.classroom.ClassroomResponse;
import com.example.quizzlet.service.ClassroomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/classroom")
@RequiredArgsConstructor
public class ClassroomController {
    private final ClassroomService classroomService;

    @PostMapping
    public ResponseEntity<Map<String,Object>> create(@RequestBody ClassroomRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(classroomService.create(request));
    }

    @GetMapping("/getMyClassrooms")
    public ResponseEntity<List<ClassroomResponse>> getMyClassrooms(){
        return ResponseEntity.ok(classroomService.getMyClassrooms());
    }

    @GetMapping("/getDetailMyClassroom/{classId}")
    public ResponseEntity<ClassroomResponse> getDetail(@PathVariable Long classId){
        return ResponseEntity.ok(classroomService.getById(classId));
    }

    @DeleteMapping("/delete/{classId}")
    public ResponseEntity<Void> delete(@PathVariable Long classId){
        classroomService.delete(classId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update/{classId}")
    public ResponseEntity<ClassroomResponse> update(@PathVariable Long classId, @RequestBody ClassroomRequest request){
        return ResponseEntity.ok(classroomService.update(classId,request));
    }

    @PostMapping("/join/{classCode}")
    public ResponseEntity<String> joinClassroom(@PathVariable String classCode){
        return ResponseEntity.ok(classroomService.joinClassroom(classCode));
    }

    @GetMapping("/{classId}/members")
    public ResponseEntity<List<ClassMemberResponse>> getClassMembers(
            @PathVariable("classId") Long classId
    ) {
        return ResponseEntity.ok(classroomService.getClassMembers(classId));
    }

    @PostMapping("/{classId}/add-studyset/{studySetId}")
    public ResponseEntity<ClassroomResponse> addStudySetToClassroom(@PathVariable Long classId, @PathVariable Long studySetId){
        return ResponseEntity.ok(classroomService.addStudySet(classId,studySetId));
    }



}
