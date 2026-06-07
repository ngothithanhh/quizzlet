package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.user.UserProfileResponse;
import com.example.quizzlet.dto.user.UserProfileUpdateRequest;
import com.example.quizzlet.dto.user.UserSearchResponse;
import com.example.quizzlet.entity.User;
import com.example.quizzlet.mapper.UserMapper;
import com.example.quizzlet.repository.UserRepository;
import com.example.quizzlet.service.UserService;
import com.example.quizzlet.ultils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public UserProfileResponse getMyProfile(){
        Long userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Không tìm thấy người dùng!"));

        return UserMapper.toResponse(user);

    }

    @Override
    public UserProfileResponse updateMyProfile(UserProfileUpdateRequest request){
        Long userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Không tìm thấy người dùng!"));

        if(request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        if(request.getUsername() != null) user.setUsername(request.getUsername());

        userRepository.save(user);
        return UserMapper.toResponse(user);
    }

    @Override
    public void delete(Long id){
        if(!userRepository.existsById(id)){
            throw new RuntimeException("Không tồn tại người dùng!");
        }

        userRepository.deleteById(id);

    }

    @Override
    public List<UserSearchResponse> search(String query){
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }

        List<UserSearchResponse> results = userRepository.searchUsers(query.trim()).stream()
                .limit(10)
                .map(user -> UserSearchResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .build())
                .collect(Collectors.toList());

        return results;
    }
}
