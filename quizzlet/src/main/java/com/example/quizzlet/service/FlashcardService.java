package com.example.quizzlet.service;

import com.example.quizzlet.dto.flashcard.CloneFlashcardsRequest;
import com.example.quizzlet.dto.flashcard.FlashcardRequest;
import com.example.quizzlet.dto.flashcard.FlashcardResponse;
import com.example.quizzlet.entity.Flashcard;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface FlashcardService {
    FlashcardResponse create(FlashcardRequest request);

    FlashcardResponse update(Long id, FlashcardRequest request);

    void delete(Long id);

    List<FlashcardResponse> getFlashcardsByStudySet(Long studySetId);

    void importFlashcards(Long studySetId, MultipartFile file);

    List<Map<String, String>> parseExcel(MultipartFile file);

    void cloneFlashcards(CloneFlashcardsRequest request);

    byte[] exportFlashcardsToExcel(Long studySetId);

    byte[] downloadTemplate();
}
