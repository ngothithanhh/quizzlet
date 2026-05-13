package com.example.quizzlet.repository;


import com.example.quizzlet.entity.MatchSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchSessionRepository extends JpaRepository<MatchSession,Long> {
}
