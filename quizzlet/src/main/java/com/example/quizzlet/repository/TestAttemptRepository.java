package com.example.quizzlet.repository;

import com.example.quizzlet.entity.TestAttempt;
import com.example.quizzlet.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {
    List<TestAttempt> findByUserOrderBySubmittedAtDesc(User user);

    List<TestAttempt> findByTestIdAndUserId(Long testId, Long userId);
}
