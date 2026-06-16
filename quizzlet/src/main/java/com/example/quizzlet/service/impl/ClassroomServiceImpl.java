package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.classroom.AddMemberRequest;
import com.example.quizzlet.dto.classroom.ClassMemberResponse;
import com.example.quizzlet.dto.classroom.ClassroomRequest;
import com.example.quizzlet.dto.classroom.ClassroomResponse;
import com.example.quizzlet.dto.study.StudySetResponse;
import com.example.quizzlet.entity.*;
import com.example.quizzlet.enums.ClassRole;
import com.example.quizzlet.enums.NotificationType;
import com.example.quizzlet.mapper.ClassMemberMapper;
import com.example.quizzlet.mapper.ClassroomMapper;
import com.example.quizzlet.mapper.StudySetMapper;
import com.example.quizzlet.repository.ClassMemberRepository;
import com.example.quizzlet.repository.ClassroomRepository;
import com.example.quizzlet.repository.FavoriteRepository;
import com.example.quizzlet.repository.StudySetRepository;
import com.example.quizzlet.repository.UserRepository;
import com.example.quizzlet.service.ClassroomService;
import com.example.quizzlet.service.NotificationService;
import com.example.quizzlet.ultils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassroomServiceImpl implements ClassroomService {
    private final UserRepository userRepository;
    private final ClassroomRepository classroomRepository;
    private final ClassMemberRepository memberRepository;
    private final StudySetRepository studySetRepository;
    private final NotificationService notificationService;
    private final FavoriteRepository favoriteRepository;

    //tao
    @Transactional
    @Override
    public Map<String, Object> create(ClassroomRequest request){
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Không tìm thấy người dùng!"));

        Classroom classroom =  Classroom.builder()
                .owner(user)
                .name(request.getName())
                .description(request.getDescription())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .inviteCode(generateInviteCode())
                .build();

        Classroom saved  = classroomRepository.save(classroom);

        ClassMember owner = ClassMember.builder()
                .id(new ClassMemberId(classroom.getId(),userId))
                .classroom(classroom)
                .user(user)
                .role(ClassRole.OWNER)
                .joinedAt(LocalDateTime.now())
                .build();

        memberRepository.save(owner);

        Map<String, Object> result = new HashMap<>();
        result.put("message","Tạo lớp học thành công");
        result.put("classroom", ClassroomMapper.toClassroomResponse(saved,owner));

        return result;

    }

    //lay danh sach lop cua toi
    @Override
    public List<ClassroomResponse> getMyClassrooms(){
        Long userId = SecurityUtils.getCurrentUserId();

        return memberRepository.findByUserId(userId)
                .stream()
                .map(member -> ClassroomMapper.toClassroomResponse(member.getClassroom(),member))
                .toList();

    }

    //lay chi tiet lop hoc
    @Transactional
    @Override
    public ClassroomResponse getById(Long id){
        Long userId = SecurityUtils.getCurrentUserId();

        ClassMember member = memberRepository.findByClassroomIdAndUserId(id,userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học hoặc bạn không phải là thành viên!"));

        Classroom classroom = classroomRepository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy lớp học!"));
        return ClassroomMapper.toClassroomResponse(classroom,member);
    }

    //xoa lop hoc
    @Override
    public void delete(Long id){
        Long userId = SecurityUtils.getCurrentUserId();

        ClassMember member = memberRepository.findByClassroomIdAndUserId(id,userId).orElseThrow(()->new RuntimeException("Không tìm thấy lớp học hoặc bạn không phải là thành viên!"));

        if(member.getRole() == ClassRole.OWNER){
            classroomRepository.deleteById(id);
        }
    }

    //cap nhat
    @Override
    public ClassroomResponse update(Long id, ClassroomRequest request){
        Long userId = SecurityUtils.getCurrentUserId();

        ClassMember member = memberRepository.findByClassroomIdAndUserId(id, userId).orElseThrow(()-> new RuntimeException("Không tìm thấy lớp học hoặc bạn không phải là thành viên!"));

        if(member.getRole() != ClassRole.OWNER){
            throw new RuntimeException("Bạn không có quyền sửa!");

        }

        Classroom classroom = classroomRepository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy lớp học!"));
        classroom.setName(request.getName());
        classroom.setDescription(request.getDescription());
        classroom.setUpdatedAt(LocalDateTime.now());

        classroomRepository.save(classroom);

        return ClassroomMapper.toClassroomResponse(classroom,member);

    }

    //tham gia lop hoc
    @Override
    public String joinClassroom(String classCode){
        Long userId = SecurityUtils.getCurrentUserId();

        Classroom classroom = classroomRepository.findByInviteCode(classCode).orElseThrow(()->new RuntimeException("Không tìm thấy lớp học này!"));

        ClassMemberId id = new ClassMemberId(classroom.getId(), userId);

        if(memberRepository.existsById(id)) throw new RuntimeException("Bạn đã tham gia lớp học này!");

        ClassMember member = ClassMember.builder()
                .id(id)
                .classroom(classroom)
                .role(ClassRole.STUDENT)
                .joinedAt(LocalDateTime.now())
                .user(userRepository.findById(userId).orElseThrow())
                .build();
        memberRepository.save(member);

        //Thông báo tới chủ phòng và giáo viên
        notificationService.createNotification(
                classroom.getOwner().getId(),
                "Thành viên mới",
                userRepository.findById(userId).get().getUsername() + "đã tham gia lớp " + classroom.getName(),
                NotificationType.NEW_MEMBER,
                classroom.getId(),
                "Classroom"
                );

        for(ClassMember m : classroom.getMembers()){
            if(m.getRole() == ClassRole.TEACHER && m.getUser() != null){
                notificationService.createNotification(
                        m.getUser().getId(),
                        "Thành viên mới",
                        userRepository.findById(userId).get().getUsername() + " đã tham gia lớp " + classroom.getName(),
                        NotificationType.NEW_MEMBER,
                        classroom.getId(),
                        "Classroom"
                );
            }
        }

        return "Tham gia lớp học thành công!";

    }

    //roi lop hoc
    @Override
    public String leaveClassroom(Long classId){
        Long userId = SecurityUtils.getCurrentUserId();

        ClassMember member = memberRepository.findByClassroomIdAndUserId(classId,userId).orElseThrow(()->new RuntimeException("Bạn không phải là thành viên của lớp!"));

        Classroom classroom = classroomRepository.findById(classId).orElseThrow(()->new RuntimeException("Không tìm thấy lớp học!"));

        if(member.getRole()==ClassRole.OWNER) throw new RuntimeException("Bạn không thể rời lớp!");

        memberRepository.delete(member);

        //Thông báo tới chủ phòng và giáo viên
        notificationService.createNotification(
                classroom.getOwner().getId(),
                "Thành viên rời khỏi lớp",
                userRepository.findById(userId).get().getUsername() + "đã rời khỏi lớp " + classroom.getName(),
                NotificationType.NEW_MEMBER,
                classroom.getId(),
                "Classroom"
        );

        for(ClassMember m : classroom.getMembers()){
            if(m.getRole() == ClassRole.TEACHER && m.getUser() != null){
                notificationService.createNotification(
                        m.getUser().getId(),
                        "Thành viên rời khỏi lớp",
                        userRepository.findById(userId).get().getUsername() + " đã rời khỏi lớp " + classroom.getName(),
                        NotificationType.NEW_MEMBER,
                        classroom.getId(),
                        "Classroom"
                );
            }
        }


        return "Rời lớp thành công!";

    }

    //lay danh sach thanh vien lop
    @Override
    public List<ClassMemberResponse> getClassMembers(Long classId){
        Long userId = SecurityUtils.getCurrentUserId();

        ClassMember member = memberRepository.findByClassroomIdAndUserId(classId,userId).orElseThrow(()->new RuntimeException("Bạn không phải thành viên của lớp học này!"));

        Classroom classroom = classroomRepository.findById(classId).orElseThrow(()->new RuntimeException("Không tìm thấy lớp học!"));

        return classroom.getMembers()
                .stream()
                .map(ClassMemberMapper ::toClassMemberResponse)
                .toList();
    }

    //them thanh vien
    @Override
    public String addMember(Long classId, AddMemberRequest request){
        Long userId = SecurityUtils.getCurrentUserId();
        ClassMember member = memberRepository.findByClassroomIdAndUserId(classId,userId).orElseThrow(()->new RuntimeException("Bạn không phải là thành viên của lớp!"));
        if(member.getRole() == ClassRole.STUDENT){
            throw new RuntimeException("Bạn không có quyền thêm thành viên!");
        }

        ClassMemberId id = new ClassMemberId(classId, request.getUserId());

        if(memberRepository.existsById(id)) throw new RuntimeException("Thành viên này đã tham gia lớp học!");

        ClassMember classMember = ClassMember.builder()
                .id(id)
                .user(userRepository.getReferenceById(request.getUserId()))
                .role(request.getRole())
                .joinedAt(LocalDateTime.now())
                .classroom(classroomRepository.getReferenceById(classId))
                .build();

        memberRepository.save(classMember);

        //thong bao co loi moi tham gia lop hoc
        Classroom classroom = classroomRepository.findById(classId).orElseThrow(()->new RuntimeException("Không tìm thấy lớp!"));
        notificationService.createNotification(
                request.getUserId(),
                "Lời mời tham gia lớp học",
                "Bạn được thêm vào lớp " + classroom.getName(),
                NotificationType.CLASS_INVITE,
                classroom.getId(),
                "Classroom"
        );

        for(ClassMember m : classroom.getMembers()){
            if(m.getRole() == ClassRole.TEACHER && m.getUser() != null){
                notificationService.createNotification(
                        m.getUser().getId(),
                        "Thành viên mới",
                        userRepository.findById(request.getUserId()).get().getUsername() + " đã tham gia lớp " + classroom.getName(),
                        NotificationType.NEW_MEMBER,
                        classroom.getId(),
                        "Classroom"
                );
            }
        }

        return "Thêm thành viên thành công!";

    }

    //xoa thanh vien
    @Override
    public String removeMember(Long classId, Long targetUserId){
        Long userId = SecurityUtils.getCurrentUserId();

        ClassMember member = memberRepository.findByClassroomIdAndUserId(classId,userId).orElseThrow(()->new RuntimeException("Bạn không phải là thành viên của lớp học!"));

        if(member.getRole() == ClassRole.STUDENT) throw new RuntimeException("Bạn không có quyền xóa!");

        memberRepository.deleteById(new ClassMemberId(classId,targetUserId));

        return "Xóa thành công!";
    }

    //cap nhat vai tro thanh vien
    public ClassMemberResponse updateMemberRole(Long classId, Long targetUserId, ClassRole role){
        Long userId = SecurityUtils.getCurrentUserId();

        ClassMember member = memberRepository.findByClassroomIdAndUserId(classId,userId).orElseThrow(()->new RuntimeException("Bạn không phải là thành viên của lớp!"));

        if(member.getRole()!= ClassRole.OWNER) throw new RuntimeException("Bạn không có quyền thay đổi vai trò của thành viên!");

        ClassMember targetMember = memberRepository.findByClassroomIdAndUserId(classId,targetUserId).orElseThrow(()->new RuntimeException("Thành viên này không tồn tại trong lớp!"));

        targetMember.setRole(role);

        return ClassMemberMapper.toClassMemberResponse(memberRepository.save(targetMember));
    }

    //them bo the vao lop hoc
    @Override
    @Transactional
    public ClassroomResponse addStudySet(Long classroomId, Long studySetId){
        Long userId = SecurityUtils.getCurrentUserId();

        ClassMember member = memberRepository.findByClassroomIdAndUserId(classroomId,userId).orElseThrow(()-> new RuntimeException("Không tìm thấy lớp học hoặc bạn không phải là thành viên!"));

        if(member.getRole() == ClassRole.STUDENT){
            throw new RuntimeException("Bạn không có quyền thêm!");
        }

        Classroom classroom = classroomRepository.findById(classroomId).orElseThrow(()-> new RuntimeException("Không tìm thấy lớp học"));

        StudySet studySet = studySetRepository.findById(studySetId).orElseThrow(()->new RuntimeException("Không tìm thấy bộ thẻ!"));


        if(classroom.getStudySets() == null){
            classroom.setStudySets(new ArrayList<>());
        }

        if(!classroom.getStudySets().contains(studySet)){
            classroom.getStudySets().add(studySet);
            classroom.setUpdatedAt(LocalDateTime.now());
            classroomRepository.save(classroom);

        }

        return ClassroomMapper.toClassroomResponse(classroom,member);

    }

    //them bo the yeu thich vao lop hoc
    @Override
    @Transactional
    public ClassroomResponse addFavoriteStudySet(Long classroomId, Long studySetId){
        Long userId = SecurityUtils.getCurrentUserId();
        FavoriteId favoriteId = new FavoriteId(userId, studySetId);

        if(!favoriteRepository.existsById(favoriteId)){
            throw new RuntimeException("Bạn chỉ có thể thêm bộ thẻ đang nằm trong mục yêu thích!");
        }

        return addStudySet(classroomId, studySetId);
    }

    //lay danh sach bo the cua lop
    @Override
    public List<StudySetResponse> getStudySetsByClassroom(Long classroomId){
        Long userId = SecurityUtils.getCurrentUserId();

        ClassMember member = memberRepository.findByClassroomIdAndUserId(classroomId,userId).orElseThrow(()-> new RuntimeException("Không tìm thấy lớp học hoặc bạn không phải là thành viên!"));

        Classroom classroom = classroomRepository.findById(classroomId).orElseThrow(()->new RuntimeException("Không tìm thấy lớp học!"));

        return classroom.getStudySets().stream()
                .map(StudySetMapper::toResponse)
                .collect(Collectors.toList());
    }

    //xoa bo the
    @Override
    public String removeStudySet(Long classroomId, Long studySetId){
        Long userId = SecurityUtils.getCurrentUserId();

        ClassMember member = memberRepository.findByClassroomIdAndUserId(classroomId,userId).orElseThrow(()-> new RuntimeException("Không tìm thấy lớp học hoặc bạn không phải là thành viên!"));

        if(member.getRole() == ClassRole.STUDENT){
            throw new RuntimeException("Bạn không có quyền thêm!");
        }

        Classroom classroom = classroomRepository.findById(classroomId).orElseThrow(()->new RuntimeException("Không tìm thấy lớp học!"));

        StudySet studySet = studySetRepository.findById(studySetId).orElseThrow(()->new RuntimeException("Không tìm thấy bộ thẻ!"));

        if(classroom.getStudySets().contains(studySet)){
            classroom.getStudySets().remove(studySet);
            classroomRepository.save(classroom);
        }

        return "Xóa thành công!";

    }

    //sinh ma
    private String generateInviteCode(){
        String code = "";
        do{
            code = UUID.randomUUID().toString().substring(0,6).toUpperCase();
        } while (classroomRepository.existsByInviteCode(code));

        return code;
    }
}
