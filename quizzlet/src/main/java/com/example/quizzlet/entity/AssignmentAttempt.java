package com.example.quizzlet.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer attemptNumber;
    private Integer score;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;

    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    @ManyToOne
    @JoinColumn(name = "test_attempt_id")
    private TestAttempt testAttempt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}