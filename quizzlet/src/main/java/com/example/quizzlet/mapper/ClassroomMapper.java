package com.example.quizzlet.mapper;

import com.example.quizzlet.dto.classroom.ClassroomResponse;
import com.example.quizzlet.entity.ClassMember;
import com.example.quizzlet.entity.Classroom;
import com.example.quizzlet.entity.User;
import com.example.quizzlet.repository.UserRepository;
import com.example.quizzlet.ultils.SecurityUtils;



public class ClassroomMapper {
    public static ClassroomResponse toClassroomResponse(Classroom classroom, ClassMember member){
        return ClassroomResponse.builder()
                .id(classroom.getId())
                .name(classroom.getName())
                .description(classroom.getDescription())
                .inviteCode(classroom.getInviteCode())
                .createdAt(classroom.getCreatedAt())
                .ownerId(classroom.getOwner().getId())
                .ownerName(classroom.getOwner().getUsername())
                .currentUserRole(String.valueOf(member.getRole()))
                .memberCount(classroom.getMembers()==null ? 0 :classroom.getMembers().size())
                .studySetCount(classroom.getStudySets()==null ? 0 : classroom.getStudySets().size())
                .build();
    }
}
