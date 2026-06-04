package com.example.quizzlet.dto.study;

import com.example.quizzlet.enums.StudyMode;
import lombok.Data;

@Data
public class StudySessionStartRequest {
    private Long studySetId;
    private StudyMode mode;
}
