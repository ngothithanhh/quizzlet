package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.assignment.AssignmentRequest;
import com.example.quizzlet.dto.assignment.AssignmentResponse;
import com.example.quizzlet.entity.*;
import com.example.quizzlet.enums.ClassRole;
import com.example.quizzlet.mapper.AssignmentMapper;
import com.example.quizzlet.repository.*;
import com.example.quizzlet.service.AssignmentService;
import com.example.quizzlet.ultils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {
    private final ClassMemberRepository memberRepository;
    private final ClassroomRepository classroomRepository;
    private final UserRepository userRepository;
    private final TestRepository testRepository;
    private final AssignmentRepository assignmentRepository;

    @Override
    public AssignmentResponse createAssignment(Long classId, AssignmentRequest request){
        Long userId = SecurityUtils.getCurrentUserId();

        ClassMember member = memberRepository.findByClassroomIdAndUserId(classId, userId).orElseThrow(()->new RuntimeException("Bạn không phải là thành viên lớp!"));

        if(member.getRole() == ClassRole.STUDENT) throw new RuntimeException("Bạn không có quyền giao bài tập!");

        Classroom classroom = classroomRepository.findById(classId).orElseThrow(()->new RuntimeException("Không tìm thấy lớp học!"));

        Test test = testRepository.findById(request.getTestId()).orElseThrow(()->new RuntimeException("Không tìm thấy bài!"));

        User assignedBy = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Không tìm thấy người dùng!"));

        Assignment assignment = Assignment.builder()
                .assignedBy(assignedBy)
                .createdAt(LocalDateTime.now())
                .title(request.getTitle())
                .description(request.getDescription())
                .test(test)
                .timeLimit(request.getTimeLimit())
                .classroom(classroom)
                .allowReview(request.getAllowReview())
                .dueDate(request.getDueDate())
                .maxAttempt(request.getMaxAttempt())
                .build();


        return AssignmentMapper.toResponse(assignmentRepository.save(assignment));
    }

    @Override
    public List<AssignmentResponse> getClassAssignments(Long classId){

        Long userId = SecurityUtils.getCurrentUserId();

        ClassMember member = memberRepository.findByClassroomIdAndUserId(classId, userId).orElseThrow(()->new RuntimeException("Bạn không phải là thành viên lớp!"));

        return assignmentRepository.findByClassroomId(classId)
                .stream()
                .map(AssignmentMapper::toResponse)
                .collect(Collectors.toList());
    }
}
