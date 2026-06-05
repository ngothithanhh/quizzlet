package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.flashcard.FlashcardResponse;
import com.example.quizzlet.dto.study.StudySessionResponse;
import com.example.quizzlet.entity.StudySession;
import com.example.quizzlet.entity.StudySet;
import com.example.quizzlet.entity.User;
import com.example.quizzlet.enums.StudyMode;
import com.example.quizzlet.mapper.StudySessionMapper;
import com.example.quizzlet.repository.StudySessionRepository;
import com.example.quizzlet.repository.StudySetRepository;
import com.example.quizzlet.repository.UserRepository;
import com.example.quizzlet.service.FlashcardStudyService;
import com.example.quizzlet.ultils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashcardStudyServiceImpl implements FlashcardStudyService {

    private final UserRepository userRepository;
    private final StudySetRepository studySetRepository;
    private final StudySessionRepository studySessionRepository;

    @Override
    public StudySessionResponse start(Long studySetId){
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("Người dùng không tồn tại!"));

        StudySet studySet = studySetRepository.findById(studySetId).orElseThrow(()->new RuntimeException("Không tìm thấy studyset!"));

        StudySession session =StudySession.builder()
                .user(user)
                .studySet(studySet)
                .mode(StudyMode.FLASHCARD)
                .startedAt(LocalDateTime.now())
                .totalQuestions(studySet.getFlashcards().size())
                .correctAnswers(0)
                .build();

        return StudySessionMapper.toResponse(studySessionRepository.save(session));

    }
    @Override
    public List<FlashcardResponse> getCards(Long studySetId){
        return null;

    }
    @Override
    public void end(Long sessionId){

    }
}
