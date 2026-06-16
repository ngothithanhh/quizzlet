package com.example.quizzlet.controller;


import com.example.quizzlet.dto.classroom.AddMemberRequest;
import com.example.quizzlet.dto.classroom.ClassMemberResponse;
import com.example.quizzlet.dto.classroom.ClassroomRequest;
import com.example.quizzlet.dto.classroom.ClassroomResponse;
import com.example.quizzlet.dto.study.StudySetResponse;
import com.example.quizzlet.enums.ClassRole;
import com.example.quizzlet.service.ClassroomService;
import lombok.Data;
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

    @PostMapping("/create")
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

    @PostMapping("/leave/{classId}")
    public ResponseEntity<String> leaveClassroom(@PathVariable Long classId){
        return ResponseEntity.ok(classroomService.leaveClassroom(classId));
    }

    @GetMapping("/getClassMembers/{classId}")
    public ResponseEntity<List<ClassMemberResponse>> getClassMembers(@PathVariable Long classId){
        return ResponseEntity.ok(classroomService.getClassMembers(classId));
    }

    @PostMapping("/add-member/{classId}")
    public ResponseEntity<String> addMember(@PathVariable Long classId, @RequestBody AddMemberRequest request){
        return ResponseEntity.ok(classroomService.addMember(classId,request));
    }

    @DeleteMapping("/delete-member/{classId}/{targetUserId}")
    public ResponseEntity<String> deleteMember(@PathVariable Long classId, @PathVariable Long targetUserId){
        return ResponseEntity.ok(classroomService.removeMember(classId,targetUserId));
    }

    @PutMapping("/update-role-member/{classId}/{targetUserId}/{role}")
    public ResponseEntity<ClassMemberResponse> updateMemberRole(@PathVariable Long classId, @PathVariable Long targetUserId, @PathVariable ClassRole role){
        return ResponseEntity.ok(classroomService.updateMemberRole(classId,targetUserId,role));
    }

    @PostMapping("/{classId}/add-studyset/{studySetId}")
    public ResponseEntity<ClassroomResponse> addStudySetToClassroom(@PathVariable Long classId, @PathVariable Long studySetId){
        return ResponseEntity.ok(classroomService.addStudySet(classId,studySetId));
    }

    @PostMapping("/{classId}/add-favorite-studyset/{studySetId}")
    public ResponseEntity<ClassroomResponse> addFavoriteStudySetToClassroom(@PathVariable Long classId, @PathVariable Long studySetId){
        return ResponseEntity.ok(classroomService.addFavoriteStudySet(classId, studySetId));
    }

    @GetMapping("/studysets/{classId}")
    public ResponseEntity<List<StudySetResponse>> getStudySetsByClassroom(@PathVariable Long classId){
        return ResponseEntity.ok(classroomService.getStudySetsByClassroom(classId));
    }

    @DeleteMapping("/delete-studyset/{classId}/{studySetId}")
    public ResponseEntity<String> deleteStudySet(@PathVariable Long classId, @PathVariable Long studySetId){
        return ResponseEntity.ok(classroomService.removeStudySet(classId,studySetId));
    }



}
