package com.example.quizzlet.dto.study;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudySetSimpleResponse {
    private Long id;

    private String title;

    private String description;

    private Boolean isPublic;

    private Integer favoriteCount;

    private String username;

    private int totalFlashcards;
}
