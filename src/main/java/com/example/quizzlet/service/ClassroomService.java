package com.example.quizzlet.service;

import com.example.quizzlet.dto.classroom.AddMemberRequest;
import com.example.quizzlet.dto.classroom.ClassMemberResponse;
import com.example.quizzlet.dto.classroom.ClassroomRequest;
import com.example.quizzlet.dto.classroom.ClassroomResponse;
import com.example.quizzlet.dto.study.StudySetResponse;
import com.example.quizzlet.entity.ClassMember;
import com.example.quizzlet.enums.ClassRole;
import com.example.quizzlet.ultils.SecurityUtils;

import java.util.List;
import java.util.Map;

public interface ClassroomService {
    Map<String, Object> create(ClassroomRequest request);

    List<ClassroomResponse> getMyClassrooms();

    ClassroomResponse getById(Long id);

    String joinClassroom(String classCode);

    ClassroomResponse addStudySet(Long classroomId, Long studySetId);

    String removeStudySet(Long classroomId, Long studySetId);

    List<StudySetResponse> getStudySetsByClassroom(Long classroomId);

    void delete(Long id);

    ClassroomResponse update(Long id, ClassroomRequest request);

    List<ClassMemberResponse> getClassMembers(Long classId);

    String addMember(Long classId, AddMemberRequest request);

    String removeMember(Long classId, Long targetUserId);

    String leaveClassroom(Long classId);

    ClassMemberResponse updateMemberRole(Long classId, Long targetUserId, ClassRole role);


}
