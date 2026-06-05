package com.example.quizzlet.repository;

import com.example.quizzlet.entity.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    Optional<AssignmentSubmission> findByAssignmentIdAndUserId(Long assignmentId, Long userId);

    boolean existsByAssignmentIdAndUserId(Long assignmentId, Long userId);
}
