package com.example.quizzlet.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "test_question_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestQuestionOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String optionText;
    private Boolean isCorrect;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private TestQuestion question;
}
