package com.example.quizzlet.dto.study;

import com.example.quizzlet.dto.flashcard.FlashcardRequest;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class StudySetRequest {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;
    private String description;
    private Boolean isPublic;
    private List<FlashcardRequest> flashcards;
}
