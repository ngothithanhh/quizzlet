package com.example.quizzlet.mapper;

import com.example.quizzlet.dto.folder.FolderResponse;
import com.example.quizzlet.dto.folder.FolderSimpleResponse;
import com.example.quizzlet.entity.Folder;

import java.util.stream.Collectors;

public class FolderMapper {
    public static FolderResponse toResponse(Folder folder){
        return FolderResponse.builder()
                .id(folder.getId())
                .name(folder.getName())
                .userId(folder.getUser().getId())
                .userName(folder.getUser().getUsername())
                .studySets(folder.getStudySets() != null ? folder.getStudySets()
                        .stream()
                        .map(StudySetMapper::toSimpleResponse)
                        .collect(Collectors.toList()):null)
                .createdAt(folder.getCreatedAt())
                .updatedAt(folder.getUpdatedAt())
                .build();
    }

    public static FolderSimpleResponse toSimpleResponse(Folder folder){
        return FolderSimpleResponse.builder()
                .id(folder.getId())
                .name(folder.getName())
                .userId(folder.getUser().getId())
                .userName(folder.getUser().getUsername())
                .createdAt(folder.getCreatedAt())
                .updatedAt(folder.getUpdatedAt())
                .build();
    }
}
