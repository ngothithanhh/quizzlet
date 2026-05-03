package com.example.quizzlet.entity;

import com.example.quizzlet.enums.StudyStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_progress",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","flashcard_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer correctCount = 0;
    private Integer wrongCount = 0;

    private Integer repetition = 0;
    private Double easeFactor = 2.5;
    private Integer intervalDays = 1;
    private Integer memoryLevel = 0;

    private Double priorityScore = 0.0;

    @Enumerated(EnumType.STRING)
    private StudyStatus status = StudyStatus.NEW;

    private LocalDateTime lastReviewAt;
    private LocalDateTime nextReviewAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "flashcard_id")
    private Flashcard flashcard;
}
