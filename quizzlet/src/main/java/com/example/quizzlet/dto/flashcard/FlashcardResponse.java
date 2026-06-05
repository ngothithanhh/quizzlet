package com.example.quizzlet.dto.flashcard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardResponse {
    private Long id;

    private String term;

    private String definition;

    private Integer position;

    private LocalDateTime updatedAt;

    private Long studySetId;

    private List<FlashcardMediaResponse> mediaList;
}
