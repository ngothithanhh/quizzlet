package com.example.quizzlet.repository;

import com.example.quizzlet.entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findByStudySetId(Long studySetId);

    List<Flashcard> findByStudySetIdOrderByPositionAsc(Long id);

    @Query("SELECT MAX(f.position) FROM Flashcard f WHERE f.studySet.id = :id")
    Integer findMaxPositionByStudySetId(@org.springframework.data.repository.query.Param("id") Long id);
}
