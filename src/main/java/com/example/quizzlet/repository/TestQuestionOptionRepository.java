package com.example.quizzlet.repository;

import com.example.quizzlet.entity.TestQuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestQuestionOptionRepository extends JpaRepository<TestQuestionOption, Long> {
}
