package com.example.quizzlet.dto.flashcard;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class FlashcardRequest {
    private Long id;
    private String term;

    private String definition;

    private Integer position;

    private Long studySetId;

    private List<FlashcardMediaRequest> mediaList;
}
