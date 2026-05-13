package com.example.quizzlet.repository;

import com.example.quizzlet.entity.TestAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestAnswerRepository extends JpaRepository<TestAnswer, Long> {
}
