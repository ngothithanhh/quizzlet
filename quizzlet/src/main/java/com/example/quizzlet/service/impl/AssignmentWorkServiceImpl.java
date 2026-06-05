package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.assignment.AssignmentAttemptResponse;
import com.example.quizzlet.dto.assignment.AssignmentStartResponse;
import com.example.quizzlet.dto.assignment.AssignmentSubmissionResponse;
import com.example.quizzlet.dto.assignment.AssignmentSubmitRequest;
import com.example.quizzlet.dto.learn.QuestionAnswerRequest;
import com.example.quizzlet.dto.learn.TestAnswerResponse;
import com.example.quizzlet.dto.learn.TestCardResponse;
import com.example.quizzlet.dto.learn.TestResultResponse;
import com.example.quizzlet.entity.*;
import com.example.quizzlet.enums.SubmissionStatus;
import com.example.quizzlet.repository.*;
import com.example.quizzlet.service.AssignmentWorkService;
import com.example.quizzlet.service.TestService;
import com.example.quizzlet.ultils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentWorkServiceImpl implements AssignmentWorkService {
    private final TestService testService;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentAttemptRepository assignmentAttemptRepository;
    private final AssignmentSubmissionRepository assignmentSubmissionRepository;
    private final ClassMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final TestQuestionRepository testQuestionRepository;
    private final TestAnswerRepository testAnswerRepository;
    private final TestAttemptRepository testAttemptRepository;

    @Override
    public AssignmentStartResponse startAssignment(Long assignmentId){
        Long userId = SecurityUtils.getCurrentUserId();

        Assignment assignment = assignmentRepository.findById(assignmentId).orElseThrow(()->new RuntimeException("Không tìm thấy bài tập!"));

        Long classId = assignment.getClassroom().getId();

        if(assignment.getDueDate() != null && assignment.getDueDate().isBefore(LocalDateTime.now())) throw new RuntimeException("Bài tập đã quá hạn!");

        TestCardResponse test = testService.getTestById(assignment.getTest().getId());

        return AssignmentStartResponse.builder()
                .assignmentId(assignment.getId())
                .testId(assignment.getTest().getId())
                .title(assignment.getTitle())
                .timeLimit(assignment.getTimeLimit())
                .dueDate(assignment.getDueDate())
                .test(test)
                .build();
    }

    @Override
    public TestResultResponse submitAssignment(Long assignmentId, AssignmentSubmitRequest request){

        Long userId = SecurityUtils.getCurrentUserId();

        Assignment assignment = assignmentRepository.findById(assignmentId).orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập!"));

        Long classId = assignment.getClassroom().getId();

        memberRepository.findByClassroomIdAndUserId(classId, userId).orElseThrow(() -> new RuntimeException("Bạn không phải thành viên lớp học này!"));

        if (assignment.getDueDate() != null && assignment.getDueDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Bài tập đã quá hạn!");
        }

        long usedAttempts = assignmentAttemptRepository.countByAssignmentIdAndUserId(assignmentId, userId);

        Integer maxAttempt = assignment.getMaxAttempt();

        if (maxAttempt != null && usedAttempts >= maxAttempt) {
            throw new RuntimeException("Bạn đã hết lượt làm bài!");
        }

        int nextAttemptNumber = (int) usedAttempts + 1;

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        Test test = assignment.getTest();

        TestAttempt testAttempt = TestAttempt.builder()
                .user(user)
                .test(test)
                .startedAt(LocalDateTime.now())
                .submittedAt(LocalDateTime.now())
                .build();

        testAttemptRepository.save(testAttempt);

        int correctCount = 0;
        int total = request.getAnswers() == null ? 0 : request.getAnswers().size();

        List<TestAnswerResponse> answers = new ArrayList<>();

        if (request.getAnswers() != null) {
            for (QuestionAnswerRequest answerRequest : request.getAnswers()) {
                TestQuestion question = testQuestionRepository.findById(answerRequest.getQuestionId()).orElseThrow(() -> new RuntimeException("Câu hỏi không tồn tại!"));

                if (!question.getTest().getId().equals(test.getId())) {
                    throw new RuntimeException("Câu hỏi không thuộc bài test của bài tập này!");
                }

                boolean isCorrect = question.getCorrectAnswer().equalsIgnoreCase(answerRequest.getAnswer());

                if (isCorrect) {
                    correctCount++;
                }

                TestAnswer answer = TestAnswer.builder()
                        .userAnswer(answerRequest.getAnswer())
                        .attempt(testAttempt)
                        .question(question)
                        .isCorrect(isCorrect)
                        .build();

                testAnswerRepository.save(answer);

                answers.add(TestAnswerResponse.builder()
                        .questionId(question.getId())
                        .userAnswer(answerRequest.getAnswer())
                        .correctAnswer(question.getCorrectAnswer())
                        .isCorrect(isCorrect)
                        .build());
            }
        }

        int score = total > 0 ? correctCount * 100 / total : 0;

        testAttempt.setScore(score);
        testAttemptRepository.save(testAttempt);

        AssignmentAttempt assignmentAttempt = AssignmentAttempt.builder()
                .assignment(assignment)
                .user(user)
                .testAttempt(testAttempt)
                .attemptNumber(nextAttemptNumber)
                .score(score)
                .startedAt(testAttempt.getStartedAt())
                .submittedAt(testAttempt.getSubmittedAt())
                .build();

        assignmentAttemptRepository.save(assignmentAttempt);

        AssignmentSubmission submission = assignmentSubmissionRepository
                .findByAssignmentIdAndUserId(assignmentId, userId)
                .orElseGet(() -> AssignmentSubmission.builder()
                        .assignment(assignment)
                        .user(user)
                        .bestScore(0)
                        .attemptCount(0)
                        .status(SubmissionStatus.NOT_STARTED)
                        .build());

        int currentBestScore = submission.getBestScore() == null ? 0 : submission.getBestScore();

        submission.setBestScore(Math.max(currentBestScore, score));
        submission.setAttemptCount(nextAttemptNumber);
        submission.setStatus(SubmissionStatus.SUBMITTED);
        submission.setCompletedAt(LocalDateTime.now());

        assignmentSubmissionRepository.save(submission);

        return TestResultResponse.builder()
                .attemptId(testAttempt.getId())
                .score(score)
                .totalQuestions(total)
                .correctAnswersCount(correctCount)
                .results(answers)
                .build();
    }

    @Override
    public AssignmentSubmissionResponse getMyResult(Long assignmentId){
        Long userId = SecurityUtils.getCurrentUserId();

        Assignment assignment = assignmentRepository.findById(assignmentId).orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập!"));

        Long classId = assignment.getClassroom().getId();

        memberRepository.findByClassroomIdAndUserId(classId, userId).orElseThrow(() -> new RuntimeException("Bạn không phải thành viên lớp học này!"));

        AssignmentSubmission submission = assignmentSubmissionRepository.findByAssignmentIdAndUserId(assignmentId, userId).orElseThrow(() -> new RuntimeException("Bạn chưa làm bài tập này!"));

        List<AssignmentAttemptResponse> attempts = assignmentAttemptRepository.findByAssignmentIdAndUserIdOrderByAttemptNumberAsc(assignmentId, userId)
                .stream()
                .map(attempt -> AssignmentAttemptResponse.builder()
                        .id(attempt.getId())
                        .attemptNumber(attempt.getAttemptNumber())
                        .score(attempt.getScore())
                        .startedAt(attempt.getStartedAt())
                        .submittedAt(attempt.getSubmittedAt())
                        .build())
                .toList();

        return AssignmentSubmissionResponse.builder()
                .assignmentId(assignment.getId())
                .userId(userId)
                .bestScore(submission.getBestScore())
                .attemptCount(submission.getAttemptCount())
                .maxAttempt(assignment.getMaxAttempt())
                .status(String.valueOf(submission.getStatus()))
                .completedAt(submission.getCompletedAt())
                .attempts(attempts)
                .build();

    }
}
