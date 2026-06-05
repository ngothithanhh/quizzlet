package com.example.quizzlet.mapper;

import com.example.quizzlet.dto.study.StudySessionResponse;
import com.example.quizzlet.entity.StudySession;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class StudySessionMapper {
    public static StudySessionResponse toResponse(StudySession session){
        int total =(session.getTotalQuestions() != null) ? session.getTotalQuestions() : 0;
        int correct = (session.getCorrectAnswers() != null) ? session.getCorrectAnswers() : 0;
        double accuracy =(session.getTotalQuestions() == 0) ? 0: (double) session.getCorrectAnswers()/ session.getTotalQuestions() * 100;
        return StudySessionResponse.builder()
                .id(session.getId())
                .mode(session.getMode())
                .studySetId(session.getStudySet().getId())
                .accuracy(accuracy)
                .totalQuestions(total)
                .correctAnswers(correct)
                .wrongAnswers(total-correct)
                .studySetTitle(session.getStudySet().getTitle())
                .endedAt(session.getEndedAt())
                .startedAt(session.getStartedAt())
                .build();
    }

//    public static StudySession toEntity(StudySessionStartRequest request){
//        return StudySessionResponse.builder()
//                .id(session.getId())
//                .mode(session.getMode())
//                .studySetId(session.getStudySet().getId())
//                .totalQuestions(session.getTotalQuestions())
//                .correctAnswers(session.getCorrectAnswers())
//                .wrongAnswers(session.getTotalQuestions()- session.getCorrectAnswers())
//                .studySetTitle(session.getStudySet().getTitle())
//                .endedAt(session.getEndedAt())
//                .startedAt(session.getStartedAt())
//                .build();
//    }
}
