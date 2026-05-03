package com.example.quizzlet.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    private Integer timeLimit;
    private Integer maxAttempt;
    private Boolean allowReview = true;

    private LocalDateTime dueDate;
    private LocalDateTime createdAt;

    @ManyToOne
    private Classroom classroom;

    @ManyToOne
    private Test test;

    @ManyToOne
    @JoinColumn(name = "assigned_by")
    private User assignedBy;
}
