package com.example.quizzlet.service;

import com.example.quizzlet.dto.learn.LearnCardRequest;
import com.example.quizzlet.dto.learn.LearnCardResponse;

import java.util.List;

public interface LearnService {
    void submit(LearnCardRequest request);
    List<LearnCardResponse> getCards(Long studySetId);
    void resetProgress(Long studySetId);

}
