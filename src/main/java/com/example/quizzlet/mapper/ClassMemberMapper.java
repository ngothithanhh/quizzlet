package com.example.quizzlet.mapper;

import com.example.quizzlet.dto.classroom.ClassMemberResponse;
import com.example.quizzlet.entity.ClassMember;

public class ClassMemberMapper {
    public static ClassMemberResponse toClassMemberResponse(ClassMember member){
        return ClassMemberResponse.builder()
                .classId(member.getClassroom().getId())
                .userId(member.getUser().getId())
                .username(member.getUser().getUsername())
                .email(member.getUser().getEmail())
                .role(String.valueOf(member.getRole()))
                .joinedAt(member.getJoinedAt())
                .build();
    }
}
