package com.example.quizzlet.dto.studyset;

import com.example.quizzlet.dto.flashcard.FlashcardResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StudySetResponse {
    private Long id;

    private String title;

    private String description;

    private Boolean isPublic;

    private Integer favoriteCount;

    private Long userId;

    private String username;

    private LocalDateTime createdAt;

    private List<FlashcardResponse> flashcards;
}
