package com.example.quizzlet.entity;

import com.example.quizzlet.enums.QuestionType;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "test_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String question;
    private String correctAnswer;

    @Enumerated(EnumType.STRING)
    private QuestionType type;

    @ManyToOne
    private Test test;

    @ManyToOne
    private Flashcard flashcard;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<TestQuestionOption> options;
}