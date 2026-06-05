package com.example.quizzlet.dto.study;

import com.example.quizzlet.entity.StudySet;
import com.example.quizzlet.entity.User;
import com.example.quizzlet.enums.LearnResult;
import com.example.quizzlet.enums.StudyMode;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudySessionResponse {
    private Long id;
    private Long studySetId;
    private String studySetTitle;
    private double accuracy;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private StudyMode mode;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;





}
