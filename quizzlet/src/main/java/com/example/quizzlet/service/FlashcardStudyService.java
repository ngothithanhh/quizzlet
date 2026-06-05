package com.example.quizzlet.service;

import com.example.quizzlet.dto.flashcard.FlashcardResponse;
import com.example.quizzlet.dto.study.StudySessionResponse;
import com.example.quizzlet.dto.study.StudySessionStartRequest;

import java.util.List;

public interface FlashcardStudyService {
    StudySessionResponse start(Long studySetId);
    List<FlashcardResponse> getCards(Long studySetId);
    void end(Long sessionId);
}
