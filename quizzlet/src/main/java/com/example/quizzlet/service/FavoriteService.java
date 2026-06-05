package com.example.quizzlet.service;

import com.example.quizzlet.dto.study.StudySetResponse;

import java.util.List;

public interface FavoriteService {
    String add(Long studySetId);
    String remove(Long studySetId);
    List<StudySetResponse> getMyFavorites();


}
