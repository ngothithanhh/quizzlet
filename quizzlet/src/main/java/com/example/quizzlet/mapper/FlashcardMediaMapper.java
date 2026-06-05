package com.example.quizzlet.mapper;

import com.example.quizzlet.dto.flashcard.FlashcardMediaRequest;
import com.example.quizzlet.dto.flashcard.FlashcardMediaResponse;
import com.example.quizzlet.entity.FlashcardMedia;

public class FlashcardMediaMapper {
    public static FlashcardMedia toEntity(FlashcardMediaRequest request) {
        return FlashcardMedia.builder()
                .url(request.getUrl())
                .type(request.getType())
                .side(request.getSide() != null ? request.getSide() : null)
                .build();
    }

    public static FlashcardMediaResponse toResponse(FlashcardMedia entity) {
        return FlashcardMediaResponse.builder()
                .id(entity.getId())
                .url(entity.getUrl())
                .type(entity.getType())
                .side(entity.getSide())
                .build();
    }
}
