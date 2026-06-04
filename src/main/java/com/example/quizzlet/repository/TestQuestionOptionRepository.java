package com.example.quizzlet.repository;

import com.example.quizzlet.entity.TestQuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestQuestionOptionRepository extends JpaRepository<TestQuestionOption, Long> {
    List<TestQuestionOption> findByQuestionId(Long questionId);
}
