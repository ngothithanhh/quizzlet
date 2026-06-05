package com.example.quizzlet.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "match_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer totalPairs;
    private Integer matchedPairs = 0;
    private Integer wrongAttempts = 0;

    private Integer completionTime;
    private Integer score;

    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    @OneToOne
    @JoinColumn(name = "session_id")
    private StudySession session;
}