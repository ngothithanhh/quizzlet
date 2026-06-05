package com.example.quizzlet.repository;

import com.example.quizzlet.entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findByStudySetId(Long studySetId);

    List<Flashcard> findByStudySetIdOrderByPositionAsc(Long id);

    Integer findMaxPositionByStudySetId(Long id);
}
