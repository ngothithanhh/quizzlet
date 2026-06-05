package com.example.quizzlet.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "test_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userAnswer;
    private Boolean isCorrect;

    @ManyToOne
    @JoinColumn(name = "attempt_id")
    private TestAttempt attempt;

    @ManyToOne
    private TestQuestion question;
}
