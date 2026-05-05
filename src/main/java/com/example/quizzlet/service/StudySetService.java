package com.example.quizzlet.service;

import com.example.quizzlet.dto.studyset.StudySetRequest;
import com.example.quizzlet.dto.studyset.StudySetResponse;
import com.example.quizzlet.dto.studyset.StudySetSimpleResponse;
import com.example.quizzlet.entity.StudySet;
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
