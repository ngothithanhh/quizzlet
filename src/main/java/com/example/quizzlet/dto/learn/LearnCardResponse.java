package com.example.quizzlet.dto.learn;

import com.example.quizzlet.dto.flashcard.FlashcardMediaResponse;
import com.example.quizzlet.enums.StudyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearnCardResponse {
    private Long flashcardId;
    private String term;
    private String definition;
    private List<FlashcardMediaResponse> mediaList;
    private Double priorityScore;
    private Integer memoryLevel;
    private StudyStatus studyStatus;



}
