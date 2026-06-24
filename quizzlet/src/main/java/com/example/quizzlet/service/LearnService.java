package com.example.quizzlet.service;

import com.example.quizzlet.dto.learn.LearnCardRequest;
import com.example.quizzlet.dto.learn.LearnCardResponse;
import com.example.quizzlet.dto.learn.LearnStudySetsRequest;

import java.util.List;

public interface LearnService {
    void submit(LearnCardRequest request);
    List<LearnCardResponse> getCards(Long studySetId);
    void resetProgress(Long studySetId);
    List<LearnCardResponse> getCardsByFolderStudySets(Long folderId, List<Long> studySetIds);
    List<LearnCardResponse> getHardCards(Long studySetId);
}
