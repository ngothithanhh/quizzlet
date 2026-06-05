package com.example.quizzlet.repository;

import com.example.quizzlet.entity.AssignmentAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentAttemptRepository extends JpaRepository<AssignmentAttempt,Long> {
    List<AssignmentAttempt> findByAssignmentIdAndUserIdOrderByAttemptNumberAsc(Long assignmentId, Long userId);

    long countByAssignmentIdAndUserId(Long assignmentId, Long userId);
}
