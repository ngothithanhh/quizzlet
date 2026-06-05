package com.example.quizzlet.dto.learn;

import com.example.quizzlet.enums.LearnResult;
import lombok.Data;

@Data
public class LearnCardRequest {
    private Long flashcardId;
    private LearnResult result;
}
