package com.example.quizzlet.entity;

import com.example.quizzlet.enums.SubmissionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_submissions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"assignment_id","user_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "best_score")
    private Integer bestScore;

    @Column(name = "attempt_count")
    private Integer attemptCount;

    private LocalDateTime completedAt;

    @Enumerated(EnumType.STRING)
    private SubmissionStatus status;

    @ManyToOne
    private Assignment assignment;

    @ManyToOne
    private User user;
}
