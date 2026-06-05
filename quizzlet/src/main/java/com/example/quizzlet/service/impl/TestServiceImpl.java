package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.learn.*;
import com.example.quizzlet.entity.*;
import com.example.quizzlet.enums.QuestionType;
import com.example.quizzlet.repository.*;
import com.example.quizzlet.service.TestService;
import com.example.quizzlet.ultils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TestServiceImpl implements TestService {
    private final UserRepository userRepository;
    private final StudySetRepository studySetRepository;
    private final StudySessionRepository studySessionRepository;
    private final TestQuestionRepository testQuestionRepository;
    private final TestAnswerRepository testAnswerRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final TestRepository testRepository;
    private final TestQuestionOptionRepository testQuestionOptionRepository;

    @Override
    public TestCardResponse getTestById(Long id) {
        Test test = testRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy bài thi!"));
        
        List<TestQuestionResponse> questionResponses = testQuestionRepository.findByTestId(id).stream().map(q -> {
            List<TestOptionResponse> options = testQuestionOptionRepository.findByQuestionId(q.getId()).stream().map(opt -> 
                TestOptionResponse.builder()
                    .id(opt.getId())
                    .optionText(opt.getOptionText())
                    .isCorrect(opt.getIsCorrect())
                    .build()
            ).toList();
            
            return TestQuestionResponse.builder()
                .id(q.getId())
                .flashcardId(q.getFlashcard().getId())
                .question(q.getQuestion())
                .correctAnswer(q.getCorrectAnswer())
                .options(options)
                .build();
        }).toList();

        return TestCardResponse.builder()
                .testId(test.getId())
                .studysetId(test.getStudySet().getId())
                .title(test.getTitle())
                .questions(questionResponses)
                .build();
    }

    @Override
    public TestCardResponse generate(CreateTestRequest request){
        Long userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Người dùng không tồn tại!"));

        StudySet studySet = studySetRepository.findById(request.getStudySetId()).orElseThrow(()->new RuntimeException("Không tìm thấy bộ thẻ!"));

        Test test = Test.builder()
                .title("Test - " + studySet.getTitle())
                .createdAt(LocalDateTime.now())
                .createdBy(user)
                .studySet(studySet)
                .timeLimit(request.getTimeLimit())
                .maxAttempt(request.getMaxAttempt())
                .showAnswer(request.getShowAnswer())
                .build();

        testRepository.save(test);

        List<TestQuestionResponse> questionResponses = new ArrayList<>();
        for (Flashcard card : studySet.getFlashcards()){
            TestQuestion question = TestQuestion.builder()
                    .test(test)
                    .flashcard(card)
                    .correctAnswer(card.getDefinition())
                    .type(QuestionType.MCQ)
                    .question(card.getTerm())
                    .build();

            testQuestionRepository.save(question);

            List<String> options = new ArrayList<>();

            options.add(card.getDefinition());

            List<Flashcard> allOtherCards = new ArrayList<>(studySet.getFlashcards());
            allOtherCards.removeIf(f -> f.getId().equals(card.getId()));
            Collections.shuffle(allOtherCards);
            List<Flashcard> randomCards = allOtherCards.stream().limit(3).toList();

            for (Flashcard f : randomCards){
                options.add(f.getDefinition());
            }

            Collections.shuffle(options);

            List<TestOptionResponse> optionResponses = new ArrayList<>();
            for (String option : options){
                boolean correct = option.equals(card.getDefinition());

                TestQuestionOption questionOption = TestQuestionOption.builder()
                        .question(question)
                        .optionText(option)
                        .isCorrect(correct)
                        .build();

                testQuestionOptionRepository.save(questionOption);

                optionResponses.add(TestOptionResponse.builder()
                                .id(questionOption.getId())
                                .optionText(option)
                                .isCorrect(correct)
                                .build());
            }

            questionResponses.add(TestQuestionResponse.builder()
                            .id(question.getId())
                            .flashcardId(card.getId())
                            .question(question.getQuestion())
                            .correctAnswer(card.getDefinition())
                            .options(optionResponses)
                    .build());


        }

        return TestCardResponse.builder()
                .testId(test.getId())
                .studysetId(studySet.getId())
                .title(test.getTitle())
                .questions(questionResponses)
                .build();
    }

    @Override
    public TestResultResponse submit(TestSubmitRequest request){
        Test test = testRepository.findById(request.getTestId()).orElseThrow(()->new RuntimeException("Không tìm thấy bài kiểm tra!"));

        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Người dùng không tồn tại!"));

        TestAttempt testAttempt = TestAttempt.builder()
                .user(user)
                .test(test)
                .startedAt(test.getCreatedAt())
                .submittedAt(LocalDateTime.now())
                .build();

        testAttemptRepository.save(testAttempt);

        int correctCount = 0;
        int total = request.getAnswers().size();

        List<TestAnswerResponse> answers = new ArrayList<>();

        for (QuestionAnswerRequest answerRequest : request.getAnswers()){
            TestQuestion question = testQuestionRepository.findById(answerRequest.getQuestionId()).orElseThrow(()->new RuntimeException("Câu hỏi không tồn tại!"));

            boolean isCorrect = question.getCorrectAnswer().equalsIgnoreCase(answerRequest.getAnswer());
            if (isCorrect) correctCount++;

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

        int score = total > 0?(correctCount*100/total) :0;
        testAttempt.setScore(score);
        testAttemptRepository.save(testAttempt);

        return TestResultResponse.builder()
                .attemptId(testAttempt.getId())
                .score(score)
                .totalQuestions(total)
                .correctAnswersCount(correctCount)
                .results(answers)
                .build();
    }
}
