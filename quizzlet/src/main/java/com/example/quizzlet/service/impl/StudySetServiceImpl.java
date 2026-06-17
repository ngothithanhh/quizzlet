package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.flashcard.FlashcardRequest;
import com.example.quizzlet.dto.study.StudySetRequest;
import com.example.quizzlet.dto.study.StudySetResponse;
import com.example.quizzlet.dto.study.StudySetSimpleResponse;
import com.example.quizzlet.entity.Flashcard;
import com.example.quizzlet.entity.StudySet;
import com.example.quizzlet.entity.User;
import com.example.quizzlet.mapper.StudySetMapper;
import com.example.quizzlet.repository.StudySetRepository;
import com.example.quizzlet.repository.UserRepository;
import com.example.quizzlet.service.FlashcardStudyService;
import com.example.quizzlet.service.StudySetService;
import com.example.quizzlet.ultils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudySetServiceImpl implements StudySetService {
    private final StudySetRepository studySetRepository;
    private final UserRepository userRepository;

    @Transactional
    @Override
    public StudySetResponse create(StudySetRequest request){
        StudySet studySet = StudySetMapper.toEntity(request);

        Long userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("Không tìm thấy người dùng!"));
        studySet.setUser(user);

        if(request.getFlashcards() != null && !request.getFlashcards().isEmpty()){
            List<FlashcardRequest> flashcards = new ArrayList<>();
            flashcards = request.getFlashcards();
            int i = 0;
            for (Flashcard flashcard : studySet.getFlashcards()){
                flashcard.setStudySet(studySet);
                flashcard.setPosition(i++);

                if (flashcard.getMediaList() != null) {
                    flashcard.getMediaList()
                            .forEach(media -> media.setFlashcard(flashcard));
                }

            }

        }

        return StudySetMapper.toResponse(studySetRepository.save(studySet));

    }

    @Transactional
    @Override
    public StudySetResponse update(Long id, StudySetRequest request){
        Long userId = SecurityUtils.getCurrentUserId();

        if(!studySetRepository.existsByIdAndUserId(id,userId))
            throw new RuntimeException("Bạn không có quyền sửa bộ thẻ này!");

        StudySet studySet = studySetRepository.findById(id).orElseThrow(()-> new RuntimeException("Không tìm thấy studyset"));

        StudySetMapper.updateEntity(studySet,request);

        if (request.getFlashcards() != null) {
            List<Flashcard> updatedFlashcards = new ArrayList<>();
            int position = 0;
            for (FlashcardRequest fReq : request.getFlashcards()) {
                Flashcard f;
                if (fReq.getId() != null) {
                    final Flashcard finalF = fReq.getId() != null ? studySet.getFlashcards().stream()
                            .filter(card -> fReq.getId().equals(card.getId()))
                            .findFirst()
                            .orElse(new Flashcard()) : new Flashcard();
                    f = finalF;
                    f.setTerm(fReq.getTerm());
                    f.setDefinition(fReq.getDefinition());
                    
                    if (fReq.getMediaList() != null) {
                        if (f.getMediaList() != null) {
                            f.getMediaList().clear();
                        } else {
                            f.setMediaList(new ArrayList<>());
                        }
                        List<com.example.quizzlet.entity.FlashcardMedia> newMedia = fReq.getMediaList().stream()
                                .map(req -> {
                                    com.example.quizzlet.entity.FlashcardMedia m = com.example.quizzlet.mapper.FlashcardMediaMapper.toEntity(req);
                                    m.setFlashcard(finalF);
                                    return m;
                                }).toList();
                        f.getMediaList().addAll(newMedia);
                    } else if (f.getMediaList() != null) {
                        f.getMediaList().clear();
                    }
                } else {
                    f = com.example.quizzlet.mapper.FlashcardMapper.toEntity(fReq);
                    if (f.getMediaList() != null) {
                        for (com.example.quizzlet.entity.FlashcardMedia media : f.getMediaList()) {
                            media.setFlashcard(f);
                        }
                    }
                }
                f.setStudySet(studySet);
                f.setPosition(position++);
                updatedFlashcards.add(f);
            }
            studySet.getFlashcards().clear();
            studySet.getFlashcards().addAll(updatedFlashcards);
        }

        return StudySetMapper.toResponse(studySetRepository.save(studySet));
    }

    @Transactional
    @Override
    public void delete(Long id){

        Long userId = SecurityUtils.getCurrentUserId();

        if(!studySetRepository.existsByIdAndUserId(id,userId))
            throw new RuntimeException("Bạn không có quyền xóa bộ thẻ này!");

        studySetRepository.deleteById(id);
    }

    @Transactional
    @Override
    public StudySetResponse getById(Long id){
        StudySet studySet = studySetRepository.findById(id).orElseThrow(()-> new RuntimeException("Không tìm thấy StudySet"));

        return StudySetMapper.toResponse(studySet);
    }

    @Transactional
    @Override
    public List<StudySetSimpleResponse> getAll(String keyword){
        List<StudySet> studySets;
        if(keyword == null || keyword.isBlank()){
            studySets = studySetRepository.findByIsPublicTrue();
        }
        else {
            studySets = studySetRepository.findByTitleContainingIgnoreCaseAndIsPublicTrue(keyword.trim());
        }

        return studySets.stream()
                .map(StudySetMapper::toSimpleResponse)
                .toList();

    }

    @Transactional
    @Override
    public List<StudySetSimpleResponse> getMyStudySets(){
        Long userId = SecurityUtils.getCurrentUserId();
        List<StudySet> studySets = studySetRepository.findByUserId(userId);

        return studySets.stream()
                .map(StudySetMapper::toSimpleResponse)
                .toList();
    }

    @Transactional
    @Override
    public StudySetResponse setVisibility(Long id, boolean isPublic){
        Long userId = SecurityUtils.getCurrentUserId();
        StudySet studySet = studySetRepository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy StudySet"));

        if(!studySet.getUser().getId().equals(userId)){
            throw new RuntimeException("Không có quyền thay đổi chế độ hiển thị!");
        }

        studySet.setIsPublic(isPublic);
        return StudySetMapper.toResponse(studySetRepository.save(studySet));
    }

    @Transactional
    @Override
    public List<StudySetSimpleResponse> getLatestStudySets(){
        return studySetRepository.findTop5ByIsPublicTrueOrderByCreatedAtDesc().stream().map(StudySetMapper::toSimpleResponse).toList();
    }

    @Transactional
    @Override
    public List<StudySetSimpleResponse> getTopFavoritedStudySets(){
        return studySetRepository.findTop5ByIsPublicTrueOrderByFavoriteCountDesc().stream().map(StudySetMapper::toSimpleResponse).toList();
    }
}
