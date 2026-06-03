package com.example.quizzlet.repository;

import com.example.quizzlet.entity.ClassMember;
import com.example.quizzlet.entity.ClassMemberId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClassMemberRepository extends JpaRepository<ClassMember, ClassMemberId> {
    boolean existsByClassroomIdAndUserId(Long classId, Long userId);

    Optional<ClassMember> findByClassroomIdAndUserId(Long classId, Long userId);

    List<ClassMember> findByClassroomId(Long classId);

    List<ClassMember> findByUserId(Long userId);

    void deleteByClassroomIdAndUserId(Long classId, Long userId);
}
