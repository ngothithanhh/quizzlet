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
import jakarta.transaction.Transactional;
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
    @Transactional
    public String add(Long studySetId) {
        Long userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        StudySet studySet = studySetRepository.findById(studySetId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bộ thẻ!"));

        FavoriteId id = new FavoriteId(userId, studySetId);

        if (favoriteRepository.existsById(id)) {
            favoriteRepository.deleteById(id);
            updateFavoriteCount(studySet, -1);
            return "Đã xóa bộ thẻ " + studySet.getTitle() + " khỏi mục yêu thích!";
        }

        Favorite favorite = Favorite.builder()
                .id(id)
                .studySet(studySet)
                .user(user)
                .build();

        favoriteRepository.save(favorite);
        updateFavoriteCount(studySet, 1);

        return "Đã thêm bộ thẻ " + studySet.getTitle() + " vào mục yêu thích!";
    }

    @Override
    @Transactional
    public String remove(Long studySetId) {
        Long userId = SecurityUtils.getCurrentUserId();

        StudySet studySet = studySetRepository.findById(studySetId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay bo the nay!"));

        FavoriteId id = new FavoriteId(userId, studySetId);

        if (favoriteRepository.existsById(id)) {
            favoriteRepository.deleteById(id);
            updateFavoriteCount(studySet, -1);
            return "Da xoa bo the " + studySet.getTitle() + " khoi muc yeu thich!";
        }

        return "Bo the nay chua nam trong muc yeu thich!";
    }

    @Override
    public List<StudySetResponse> getMyFavorites() {
        Long userId = SecurityUtils.getCurrentUserId();

        return favoriteRepository.findStudySetsByUserId(userId)
                .stream()
                .map(StudySetMapper::toResponse)
                .collect(Collectors.toList());
    }

    private void updateFavoriteCount(StudySet studySet, int delta) {
        int current = studySet.getFavoriteCount() == null ? 0 : studySet.getFavoriteCount();
        studySet.setFavoriteCount(Math.max(0, current + delta));
        studySetRepository.save(studySet);
    }
}
