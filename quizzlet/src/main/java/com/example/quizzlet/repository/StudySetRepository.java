package com.example.quizzlet.repository;

import com.example.quizzlet.entity.StudySet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface StudySetRepository extends JpaRepository<StudySet, Long> {
    List<StudySet> findByIsPublicTrue();

    List<StudySet> findByTitleContainingIgnoreCaseAndIsPublicTrue(String keyword);

    List<StudySet> findByUserId(Long userId);

    List<StudySet> findTop5ByIsPublicTrueOrderByCreatedAtDesc();

    List<StudySet> findTop5ByIsPublicTrueOrderByFavoriteCountDesc();

}
