package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.learn.MatchAnswerRequest;
import com.example.quizzlet.dto.learn.MatchAnswerResponse;
import com.example.quizzlet.dto.learn.MatchCardResponse;
import com.example.quizzlet.dto.learn.MatchStartResponse;
import com.example.quizzlet.entity.*;
import com.example.quizzlet.enums.StudyMode;
import com.example.quizzlet.repository.*;
import com.example.quizzlet.service.MatchService;
import com.example.quizzlet.ultils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchServiceImpl implements MatchService {
    private final UserRepository userRepository;
    private final StudySetRepository studySetRepository;
    private final StudySessionRepository studySessionRepository;
    private final MatchSessionRepository matchSessionRepository;
    private final FlashcardRepository flashcardRepository;
    private final MatchAttemptRepository matchAttemptRepository;
    @Override
    public MatchStartResponse startMatch(Long studySetId){
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Người dùng không tồn tại!"));
        StudySet studySet = studySetRepository.findById(studySetId).orElseThrow(()->new RuntimeException("Không tìm thấy bộ thẻ!"));

        StudySession session = StudySession.builder()
                .studySet(studySet)
                .user(user)
                .mode(StudyMode.MATCH)
                .startedAt(LocalDateTime.now())
                .totalQuestions(studySet.getFlashcards().size())
                .correctAnswers(0)
                .build();

        studySessionRepository.save(session);

        MatchSession matchSession = MatchSession.builder()
                .session(session)
                .startedAt(LocalDateTime.now())
                .matchedPairs(0)
                .totalPairs(studySet.getFlashcards().size())
                .score(0)
                .wrongAttempts(0)
                .build();

        matchSessionRepository.save(matchSession);

        List<MatchCardResponse> cards = studySet.getFlashcards().stream()
                .map(card -> MatchCardResponse.builder()
                        .flashcardId(card.getId())
                        .term(card.getTerm())
                        .definition(card.getDefinition())
                        .build())
                .collect(Collectors.toList());

        Collections.shuffle(cards);

        return MatchStartResponse.builder()
                .sessionId(session.getId())
                .matchSessionId(matchSession.getId())
                .totalPairs(cards.size())
                .responses(cards)
                .build();

    }

    @Override
    public MatchAnswerResponse submitAnswer(MatchAnswerRequest request){
        MatchSession matchSession = matchSessionRepository.findById(request.getMatchSessionId()).orElseThrow(()->new RuntimeException("Không tìm thấy lịch sử nối!"));
        Flashcard flashcard = flashcardRepository.findById(request.getFlashcardId()).orElseThrow(()->new RuntimeException("Không tìm thấy thẻ!"));
        boolean correct = flashcard.getTerm().equals(request.getSelectedTerm()) && flashcard.getDefinition().equals(request.getSelectedDefinition());
        MatchAttempt attempt = MatchAttempt.builder()
                .matchSession(matchSession)
                .flashcard(flashcard)
                .isCorrect(correct)
                .selectedTerm(request.getSelectedTerm())
                .selectedDefinition(request.getSelectedDefinition())
                .attemptedAt(LocalDateTime.now())
                .build();

        matchAttemptRepository.save(attempt);

        long correctCount = matchAttemptRepository.countByMatchSessionAndIsCorrectTrue(matchSession);
        matchSession.setMatchedPairs((int) correctCount);
        matchSession.setScore((int) correctCount * 10);
        
        if (!correct) {
            matchSession.setWrongAttempts(matchSession.getWrongAttempts()+1);
        }

        boolean completed = matchSession.getMatchedPairs().equals(matchSession.getTotalPairs());

        if(completed){
            matchSession.setCompletedAt(LocalDateTime.now());
            long duration = Duration.between(matchSession.getStartedAt(), LocalDateTime.now()).toMillis();
            matchSession.setCompletionTime((int) duration);
            StudySession session = matchSession.getSession();
            session.setEndedAt(LocalDateTime.now());
            session.setCorrectAnswers(matchSession.getMatchedPairs());
        }

        matchSessionRepository.save(matchSession);

        return MatchAnswerResponse.builder()
                .correct(correct)
                .matchedPairs(matchSession.getMatchedPairs())
                .wrongAttempts(matchSession.getWrongAttempts())
                .completed(completed)
                .score(matchSession.getScore())
                .build();
    }
}
