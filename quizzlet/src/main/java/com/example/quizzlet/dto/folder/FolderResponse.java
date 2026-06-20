package com.example.quizzlet.dto.folder;

import com.example.quizzlet.dto.study.StudySetSimpleResponse;
import com.example.quizzlet.entity.StudySet;
import com.example.quizzlet.entity.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FolderResponse {
    private Long id;
    private String name;
    private Long userId;
    private String userName;
    private List<StudySetSimpleResponse> studySets;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
