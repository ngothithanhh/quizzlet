package com.example.quizzlet.mapper;

import com.example.quizzlet.dto.flashcard.FlashcardMediaRequest;
import com.example.quizzlet.dto.flashcard.FlashcardMediaResponse;
import com.example.quizzlet.dto.flashcard.FlashcardRequest;
import com.example.quizzlet.dto.flashcard.FlashcardResponse;
import com.example.quizzlet.entity.Flashcard;
import com.example.quizzlet.entity.FlashcardMedia;
import com.example.quizzlet.entity.StudySet;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class FlashcardMapper {

    public static FlashcardResponse toResponse(Flashcard entity) {
        if (entity == null) return null;

        return FlashcardResponse.builder()
                .id(entity.getId())
                .term(entity.getTerm())
                .definition(entity.getDefinition())
                .position(entity.getPosition())
                .updatedAt(entity.getUpdatedAt())
                .studySetId(entity.getStudySet() != null ? entity.getStudySet().getId() : null)
                .mediaList(mapMediaToResponse(entity.getMediaList()))
                .build();
    }


    public static Flashcard toEntity(FlashcardRequest request) {
        if (request == null) return null;



        return Flashcard.builder()
                .term(request.getTerm())
                .definition(request.getDefinition())
                .position(request.getPosition())
                .updatedAt(LocalDateTime.now())
                .mediaList(mapMediaToEntity(request.getMediaList()))
                .build();
    }


    public static void updateEntity(Flashcard entity, FlashcardRequest request) {
        if (entity == null || request == null) return;

        entity.setTerm(request.getTerm());
        entity.setDefinition(request.getDefinition());
        entity.setPosition(request.getPosition());
        entity.setUpdatedAt(LocalDateTime.now());
    }


    private static List<FlashcardMediaResponse> mapMediaToResponse(List<FlashcardMedia> mediaList) {
        if (mediaList == null) return null;

        return mediaList.stream()
                .map(FlashcardMediaMapper::toResponse)
                .collect(Collectors.toList());
    }

    private static List<FlashcardMedia> mapMediaToEntity(List<FlashcardMediaRequest> requests) {
        if (requests == null) return null;

        return requests.stream()
                .map(FlashcardMediaMapper::toEntity)
                .collect(Collectors.toList());
    }
}
