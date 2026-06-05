package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.history.LearnHistoryResponse;
import com.example.quizzlet.dto.history.MatchHistoryResponse;
import com.example.quizzlet.dto.history.TestHistoryResponse;
import com.example.quizzlet.entity.User;
import com.example.quizzlet.repository.LearnAttemptRepository;
import com.example.quizzlet.repository.MatchSessionRepository;
import com.example.quizzlet.repository.TestAttemptRepository;
import com.example.quizzlet.repository.UserRepository;
import com.example.quizzlet.service.HistoryService;
import com.example.quizzlet.ultils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoryServiceImpl implements HistoryService {

    private final UserRepository userRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final LearnAttemptRepository learnAttemptRepository;
    private final MatchSessionRepository matchSessionRepository;

    @Override
    public List<TestHistoryResponse> getTestHistory() {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại!"));

        return testAttemptRepository.findByUserOrderBySubmittedAtDesc(user).stream()
                .map(attempt -> TestHistoryResponse.builder()
                        .attemptId(attempt.getId())
                        .studySetId(attempt.getTest().getStudySet().getId())
                        .studySetTitle(attempt.getTest().getStudySet().getTitle())
                        .score(attempt.getScore())
                        .startedAt(attempt.getStartedAt())
                        .submittedAt(attempt.getSubmittedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<LearnHistoryResponse> getLearnHistory() {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại!"));

        return learnAttemptRepository.findByUserOrderByStudiedAtDesc(user).stream()
                .map(attempt -> LearnHistoryResponse.builder()
                        .attemptId(attempt.getId())
                        .studySetId(attempt.getFlashcard().getStudySet().getId())
                        .studySetTitle(attempt.getFlashcard().getStudySet().getTitle())
                        .result(attempt.getResult().name())
                        .responseTime(attempt.getResponseTime())
                        .studiedAt(attempt.getStudiedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<MatchHistoryResponse> getMatchHistory() {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại!"));

        return matchSessionRepository.findByUserOrderByCompletedAtDesc(user).stream()
                .map(session -> MatchHistoryResponse.builder()
                        .sessionId(session.getId())
                        .studySetId(session.getSession().getStudySet().getId())
                        .studySetTitle(session.getSession().getStudySet().getTitle())
                        .timeMs(session.getCompletionTime())
                        .score(session.getScore())
                        .startedAt(session.getStartedAt())
                        .completedAt(session.getCompletedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
