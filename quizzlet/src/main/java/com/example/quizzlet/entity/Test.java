package com.example.quizzlet.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Integer timeLimit;
    private Integer maxAttempt;
    private Boolean showAnswer = true;

    private LocalDateTime createdAt;

    @ManyToOne
    private StudySet studySet;

    @ManyToOne
    private Classroom classroom;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
}
