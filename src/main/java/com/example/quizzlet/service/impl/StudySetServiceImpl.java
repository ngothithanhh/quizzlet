package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.studyset.StudySetRequest;
import com.example.quizzlet.dto.studyset.StudySetResponse;
import com.example.quizzlet.dto.studyset.StudySetSimpleResponse;
import com.example.quizzlet.entity.StudySet;
import com.example.quizzlet.entity.User;
import com.example.quizzlet.mapper.StudySetMapper;
import com.example.quizzlet.repository.StudySetRepository;
import com.example.quizzlet.repository.UserRepository;
import com.example.quizzlet.service.StudySetService;
import com.example.quizzlet.ultils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudySetServiceImpl implements StudySetService {
    private final StudySetRepository studySetRepository;
    private final UserRepository userRepository;

    @Transactional
    @Override
    public StudySetResponse create(StudySetRequest request){
        StudySet studySet = StudySetMapper.toEntity(request);

        Long userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("Không tìm thấy người dùng!"));
        studySet.setUser(user);

        return StudySetMapper.toResponse(studySetRepository.save(studySet));

    }

    @Transactional
    @Override
    public StudySetResponse update(Long id, StudySetRequest request){
        StudySet studySet = studySetRepository.findById(id).orElseThrow(()-> new RuntimeException("Không tìm thấy studyset"));

        StudySetMapper.updateEntity(studySet,request);

        return StudySetMapper.toResponse(studySetRepository.save(studySet));

    }

    @Transactional
    @Override
    public void delete(Long id){
        studySetRepository.deleteById(id);
    }

    @Transactional
    @Override
    public StudySetResponse getById(Long id){
        StudySet studySet = studySetRepository.findById(id).orElseThrow(()-> new RuntimeException("Không tìm thấy StudySet"));

        return StudySetMapper.toResponse(studySet);
    }

    @Transactional
    @Override
    public List<StudySetSimpleResponse> getAll(String keyword){
        List<StudySet> studySets;
        if(keyword == null || keyword.isBlank()){
            studySets = studySetRepository.findByIsPublicTrue();
        }
        else {
            studySets = studySetRepository.findByTitleContainingIgnoreCaseAndIsPublicTrue(keyword.trim());
        }

        return studySets.stream()
                .map(StudySetMapper::toSimpleResponse)
                .toList();

    }

    @Transactional
    @Override
    public List<StudySetSimpleResponse> getMyStudySets(){
        Long userId = SecurityUtils.getCurrentUserId();
        List<StudySet> studySets = studySetRepository.findByUserId(userId);

        return studySets.stream()
                .map(StudySetMapper::toSimpleResponse)
                .toList();
    }

    @Transactional
    @Override
    public StudySetResponse setVisibility(Long id, boolean isPublic){
        Long userId = SecurityUtils.getCurrentUserId();
        StudySet studySet = studySetRepository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy StudySet"));

        if(!studySet.getUser().getId().equals(userId)){
            throw new RuntimeException("Không có quyền thay đổi chế độ hiển thị!");
        }

        studySet.setIsPublic(isPublic);
        return StudySetMapper.toResponse(studySetRepository.save(studySet));
    }
}
