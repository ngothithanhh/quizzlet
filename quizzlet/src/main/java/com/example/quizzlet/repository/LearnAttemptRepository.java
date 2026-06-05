package com.example.quizzlet.repository;

import com.example.quizzlet.entity.LearnAttempt;
import com.example.quizzlet.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearnAttemptRepository extends JpaRepository<LearnAttempt, Long> {
    List<LearnAttempt> findByUserOrderByStudiedAtDesc(User user);
}
