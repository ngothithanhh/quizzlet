package com.example.quizzlet.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "match_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String selectedTerm;
    private String selectedDefinition;

    private Boolean isCorrect;

    private LocalDateTime attemptedAt;

    @ManyToOne
    @JoinColumn(name = "match_session_id")
    private MatchSession matchSession;

    @ManyToOne
    private Flashcard flashcard;
}
