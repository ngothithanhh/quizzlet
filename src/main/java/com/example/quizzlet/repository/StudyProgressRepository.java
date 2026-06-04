package com.example.quizzlet.repository;

import com.example.quizzlet.entity.Flashcard;
import com.example.quizzlet.entity.StudyProgress;
import com.example.quizzlet.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudyProgressRepository extends JpaRepository<StudyProgress, Long> {
    List<StudyProgress> findByUserOrderByPriorityScoreDesc(User user);
    Optional<StudyProgress> findByUserAndFlashcard(User user, Flashcard flashcard);
    List<StudyProgress> findByUserAndFlashcardIn(User user, List<Flashcard> flashcards);
}
