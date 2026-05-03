package com.example.quizzlet.entity;

import com.example.quizzlet.enums.StudyMode;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer totalQuestions;
    private Integer correctAnswers;

    @Enumerated(EnumType.STRING)
    private StudyMode mode;

    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    @ManyToOne
    private User user;

    @ManyToOne
    @JoinColumn(name = "study_set_id")
    private StudySet studySet;
}
