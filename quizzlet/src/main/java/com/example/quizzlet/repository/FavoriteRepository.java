package com.example.quizzlet.repository;

import com.example.quizzlet.entity.Favorite;
import com.example.quizzlet.entity.FavoriteId;
import com.example.quizzlet.entity.StudySet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {
    @Query("SELECT DISTINCT ss FROM Favorite f JOIN f.studySet ss LEFT JOIN FETCH ss.flashcards WHERE f.user.id = :userId")
    List<StudySet> findStudySetsByUserId(@Param("userId") Long userId);
}
