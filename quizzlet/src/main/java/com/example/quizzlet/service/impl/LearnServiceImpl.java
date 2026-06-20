package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.flashcard.FlashcardMediaResponse;
import com.example.quizzlet.dto.flashcard.FlashcardResponse;
import com.example.quizzlet.dto.learn.LearnCardRequest;
import com.example.quizzlet.dto.learn.LearnCardResponse;
import com.example.quizzlet.dto.learn.LearnStudySetsRequest;
import com.example.quizzlet.entity.*;
import com.example.quizzlet.enums.LearnResult;
import com.example.quizzlet.enums.StudyStatus;
import com.example.quizzlet.repository.*;
import com.example.quizzlet.service.LearnService;
import com.example.quizzlet.ultils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LearnServiceImpl implements LearnService {
    private final UserRepository userRepository;
    private final StudySetRepository studySetRepository;
    private final StudyProgressRepository studyProgressRepository;
    private final FlashcardRepository flashcardRepository;
    private final LearnAttemptRepository learnAttemptRepository;
    private final FolderRepository folderRepository;
    @Override
    public void submit(LearnCardRequest request){
        Long userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Người dùng không tồn tại!"));

        Flashcard flashcard = flashcardRepository.findById(request.getFlashcardId()).orElseThrow(()->new RuntimeException("Không tìm thấy thẻ!"));

        StudyProgress progress = studyProgressRepository.findByUserAndFlashcard(user,flashcard).orElse(
                StudyProgress.builder()
                        .user(user)
                        .flashcard(flashcard)
                        .status(StudyStatus.NEW)
                        .correctCount(0)
                        .wrongCount(0)
                        .memoryLevel(0)
                        .priorityScore(0.0)
                        .repetition(0)
                        .easeFactor(2.5)
                        .intervalDays(1)
                        .build()
        );

        LearnResult result = request.getResult();

        switch (result){
            case HARD -> {

                progress.setCorrectCount(progress.getCorrectCount() + 1);

                progress.setPriorityScore(progress.getPriorityScore() + 60);

                progress.setMemoryLevel(progress.getMemoryLevel() + 1);

                progress.setStatus(StudyStatus.LEARNING);
            }

            case EASY -> {

                progress.setCorrectCount(progress.getCorrectCount() + 1);

                progress.setPriorityScore(Math.max(0, progress.getPriorityScore() - 50));

                progress.setMemoryLevel(progress.getMemoryLevel() + 4);

                progress.setStatus(StudyStatus.MASTERED);
            }

            case GOOD -> {

                progress.setCorrectCount(progress.getCorrectCount() + 1);

                progress.setPriorityScore(Math.max(0, progress.getPriorityScore() + 20));

                progress.setMemoryLevel(progress.getMemoryLevel() + 2);

                progress.setStatus(StudyStatus.REVIEW);
            }

            case AGAIN -> {

                progress.setWrongCount(
                        progress.getWrongCount() + 1
                );

                progress.setPriorityScore(
                        progress.getPriorityScore() + 100
                );

                progress.setMemoryLevel(0);

                progress.setStatus(
                        StudyStatus.LEARNING
                );
            }
        }
        progress.setRepetition(progress.getRepetition()+1);
        progress.setLastReviewAt(LocalDateTime.now());
        progress.setNextReviewAt(LocalDateTime.now().plusDays(progress.getIntervalDays()));
        studyProgressRepository.save(progress);

        LearnAttempt attempt = LearnAttempt.builder()
                .user(user)
                .flashcard(flashcard)
                .result(result)
                .studiedAt(LocalDateTime.now())
                .build();
        learnAttemptRepository.save(attempt);

    }
    @Override
    public List<LearnCardResponse> getCards(Long studySetId){
        Long userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Người dùng không tồn tại!"));

        StudySet studySet = studySetRepository.findById(studySetId).orElseThrow(()->new RuntimeException("Không tìm thấy bộ thẻ!"));

        return studySet.getFlashcards().stream()
                .filter(flashcard -> {
                    StudyProgress progress = studyProgressRepository.findByUserAndFlashcard(user,flashcard).orElse(null);
                    return progress == null || progress.getStatus() != StudyStatus.MASTERED;
                })
//                .map(flashcard -> {
//                    StudyProgress progress = studyProgressRepository.findByUserAndFlashcard(user,flashcard).orElse(null);
//
//                    double priotityScore = progress != null ? progress.getPriorityScore() : 0;
//
//                    int memoryLevel = progress != null ? progress.getMemoryLevel() : 0;
//
//                    StudyStatus status = progress != null ? progress.getStatus() : StudyStatus.NEW;
//
//                    return LearnCardResponse.builder()
//                            .flashcardId(flashcard.getId())
//                            .term(flashcard.getTerm())
//                            .definition(flashcard.getDefinition())
//                            .mediaList(flashcard.getMediaList().stream()
//                                    .map(media ->
//                                        FlashcardMediaResponse.builder()
//                                                .id(media.getId())
//                                                .url(media.getUrl())
//                                                .type(media.getType())
//                                                .side(media.getSide())
//                                                .build()
//                                     )
//                                    .toList()
//                            )
//                            .priorityScore(priotityScore)
//                            .memoryLevel(memoryLevel)
//                            .studyStatus(status)
//                            .build();
//                })
                .map(flashcard -> toLearnCardResponse(user,flashcard))
                .sorted(Comparator.comparing(LearnCardResponse::getPriorityScore).reversed())
                .toList();
    }

    @Override
    public void resetProgress(Long studySetId) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại!"));
        StudySet studySet = studySetRepository.findById(studySetId).orElseThrow(() -> new RuntimeException("Không tìm thấy bộ thẻ!"));
        
        List<Flashcard> flashcards = studySet.getFlashcards();
        if (flashcards != null && !flashcards.isEmpty()) {
            List<StudyProgress> progressList = studyProgressRepository.findByUserAndFlashcardIn(user, flashcards);
            studyProgressRepository.deleteAll(progressList);
        }
    }

    @Override
    public List<LearnCardResponse> getCardsByFolderStudySets(Long folderId, List<Long> studySetIds){
        Long userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Người dùng không tồn tại!"));

        if(!folderRepository.existsByIdAndUserId(folderId, userId)) throw new RuntimeException("Bạn không có quyền học thư mục này!");

        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new RuntimeException("Không tìm thấy thư mục!"));

        if (studySetIds == null || studySetIds.isEmpty()) throw new RuntimeException("Vui lòng chọn ít nhất một học phần!");

        List<StudySet> selectedStudySets = folder.getStudySets().stream()
                .filter(studySet -> studySetIds.contains(studySet.getId()))
                .toList();

        if (selectedStudySets.size() != studySetIds.size()) throw new RuntimeException("Có học phần không thuộc thư mục này!");


//        List<StudySet> studySets = studySetRepository.findAllById(studySetIds);

        return selectedStudySets.stream()
                .flatMap(studySet -> studySet.getFlashcards().stream())
                .filter(flashcard -> {
                    StudyProgress progress = studyProgressRepository
                            .findByUserAndFlashcard(user, flashcard)
                            .orElse(null);

                    return progress == null || progress.getStatus() != StudyStatus.MASTERED;
                })
                .map(flashcard -> toLearnCardResponse(user, flashcard))
                .sorted(Comparator.comparing(LearnCardResponse::getPriorityScore).reversed())
                .toList();

    }

    private LearnCardResponse toLearnCardResponse(User user, Flashcard flashcard) {
        StudyProgress progress = studyProgressRepository
                .findByUserAndFlashcard(user, flashcard)
                .orElse(null);

        double priorityScore = progress != null ? progress.getPriorityScore() : 0;
        int memoryLevel = progress != null ? progress.getMemoryLevel() : 0;
        StudyStatus status = progress != null ? progress.getStatus() : StudyStatus.NEW;

        return LearnCardResponse.builder()
                .flashcardId(flashcard.getId())
                .term(flashcard.getTerm())
                .definition(flashcard.getDefinition())
                .mediaList(flashcard.getMediaList().stream()
                        .map(media -> FlashcardMediaResponse.builder()
                                .id(media.getId())
                                .url(media.getUrl())
                                .type(media.getType())
                                .side(media.getSide())
                                .build())
                        .toList())
                .priorityScore(priorityScore)
                .memoryLevel(memoryLevel)
                .studyStatus(status)
                .build();
    }

}
