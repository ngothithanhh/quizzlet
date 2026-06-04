package com.example.quizzlet.entity;

import com.example.quizzlet.enums.MediaSide;
import com.example.quizzlet.enums.MediaType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "flashcard_media")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashcardMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    @Enumerated(EnumType.STRING)
    private MediaType type;

    @Enumerated(EnumType.STRING)
    private MediaSide side = MediaSide.TERM;

    @ManyToOne
    @JoinColumn(name = "flashcard_id")
    private Flashcard flashcard;
}
