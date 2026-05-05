package com.example.quizzlet.mapper;

import com.example.quizzlet.dto.flashcard.FlashcardRequest;
import com.example.quizzlet.dto.studyset.StudySetRequest;
import com.example.quizzlet.dto.studyset.StudySetResponse;
import com.example.quizzlet.dto.studyset.StudySetSimpleResponse;
import com.example.quizzlet.entity.Flashcard;
import com.example.quizzlet.entity.StudySet;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

public class StudySetMapper {
    public static StudySetResponse toResponse(StudySet entity) {
        return StudySetResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .isPublic(entity.getIsPublic())
                .favoriteCount(entity.getFavoriteCount())
                .userId(entity.getUser().getId())
                .username(entity.getUser().getUsername())
                .createdAt(entity.getCreatedAt())
                .flashcards(entity.getFlashcards() != null
                        ? entity.getFlashcards().stream()
                        .map(FlashcardMapper::toResponse)
                        .collect(Collectors.toList())
                        : null)
                .build();
    }

    public static StudySetSimpleResponse toSimpleResponse(StudySet entity) {
        return StudySetSimpleResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .isPublic(entity.getIsPublic())
                .favoriteCount(entity.getFavoriteCount())
                .username(entity.getUser().getUsername())
                .totalFlashcards(entity.getFlashcards() != null
                        ? entity.getFlashcards().size()
                        : 0)
                .build();
    }

    public static StudySet toEntity(StudySetRequest request){
        if(request == null) return null;

        return StudySet.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .isPublic(request.getIsPublic())
                .build();
    }

    public static void updateEntity(StudySet entity, StudySetRequest request){
        if(entity == null || request == null) return;

        entity.setDescription(request.getDescription());
        entity.setTitle(request.getTitle());
        entity.setIsPublic(request.getIsPublic());


    }
}
