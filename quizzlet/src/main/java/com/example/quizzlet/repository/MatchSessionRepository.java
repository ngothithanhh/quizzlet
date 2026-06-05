package com.example.quizzlet.repository;


import com.example.quizzlet.entity.MatchSession;
import com.example.quizzlet.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MatchSessionRepository extends JpaRepository<MatchSession,Long> {
    @Query("SELECT m FROM MatchSession m WHERE m.session.user = :user ORDER BY m.completedAt DESC")
    List<MatchSession> findByUserOrderByCompletedAtDesc(@Param("user") User user);
}
