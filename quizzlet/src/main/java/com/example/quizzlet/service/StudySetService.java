package com.example.quizzlet.service;

import com.example.quizzlet.dto.study.StudySetRequest;
import com.example.quizzlet.dto.study.StudySetResponse;
import com.example.quizzlet.dto.study.StudySetSimpleResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface StudySetService {
    @Transactional
    StudySetResponse create(StudySetRequest request);

    @Transactional
    StudySetResponse update(Long id, StudySetRequest request);

    void delete(Long id);
    StudySetResponse getById(Long id);
    List<StudySetSimpleResponse> getAll(String keyword);
    List<StudySetSimpleResponse> getMyStudySets();
    StudySetResponse setVisibility(Long id, boolean isPublic);
}
