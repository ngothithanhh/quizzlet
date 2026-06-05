package com.example.quizzlet.entity;

import com.example.quizzlet.enums.LearnResult;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "learn_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LearnResult result;


    @Column(name = "response_time")
    private Integer responseTime;

    @Column(name = "studied_at")
    private LocalDateTime studiedAt;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flashcard_id", nullable = false)
    private Flashcard flashcard;


    @PrePersist
    public void prePersist() {
        this.studiedAt = LocalDateTime.now();
    }
}
