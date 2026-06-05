package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.study.StudySetResponse;
import com.example.quizzlet.entity.Favorite;
import com.example.quizzlet.entity.FavoriteId;
import com.example.quizzlet.entity.StudySet;
import com.example.quizzlet.entity.User;
import com.example.quizzlet.mapper.StudySetMapper;
import com.example.quizzlet.repository.FavoriteRepository;
import com.example.quizzlet.repository.StudySetRepository;
import com.example.quizzlet.repository.UserRepository;
import com.example.quizzlet.service.FavoriteService;
import com.example.quizzlet.ultils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteSeriveImpl implements FavoriteService {

    private final StudySetRepository studySetRepository;
    private final UserRepository userRepository;
    private final FavoriteRepository favoriteRepository;

    @Override
    public String add(Long studySetId){
        Long userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Không tìm thấy người dùng!"));

        StudySet studySet = studySetRepository.findById(studySetId).orElseThrow(()->new RuntimeException("Không tìm thâý bộ thẻ này!"));

        Favorite favorite = Favorite.builder()
                .id(new FavoriteId(userId, studySetId))
                .studySet(studySet)
                .user(user)
                .build();

        favoriteRepository.save(favorite);

        Integer current = studySet.getFavoriteCount() + 1;

        studySet.setFavoriteCount(current);

        studySetRepository.save(studySet);

        return "Đã thêm bộ thẻ " + studySet.getTitle() + " vào mục yêu thích!";
    }

    @Override
    public String remove(Long studySetId){
        Long userId = SecurityUtils.getCurrentUserId();

        StudySet studySet = studySetRepository.findById(studySetId).orElseThrow(()->new RuntimeException("Không tìm thâý bộ thẻ này!"));

        FavoriteId id =new FavoriteId(userId,studySetId);

        if(favoriteRepository.existsById(id)){
            favoriteRepository.deleteById(id);

            Integer current = studySet.getFavoriteCount() + 1;

            studySet.setFavoriteCount(current);

            studySetRepository.save(studySet);

            return "Đã xóa bộ thẻ " + studySet.getTitle() + " khỏi mục yêu thích!";
        }

        return null;
    }

    @Override
    public List<StudySetResponse> getMyFavorites(){
        Long userId = SecurityUtils.getCurrentUserId();

        return favoriteRepository.findStudySetsByUserId(userId)
                .stream()
                .map(StudySetMapper ::toResponse)
                .collect(Collectors.toList());
    }
}
