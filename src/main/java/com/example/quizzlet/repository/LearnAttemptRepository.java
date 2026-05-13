package com.example.quizzlet.repository;

import com.example.quizzlet.entity.LearnAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnAttemptRepository extends JpaRepository<LearnAttempt, Long> {
}
