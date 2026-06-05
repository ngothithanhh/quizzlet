package com.example.quizzlet.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "study_sets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudySet extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    @Builder.Default
    @Column(name = "is_public")
    private Boolean isPublic = true;

    @Builder.Default
    @Column(name = "favorite_count")
    private Integer favoriteCount = 0;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "studySet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Flashcard> flashcards;

    @ManyToMany(mappedBy = "studySets")
    private List<Classroom> classrooms;

}
