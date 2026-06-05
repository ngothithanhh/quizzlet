package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.user.UserProfileResponse;
import com.example.quizzlet.dto.user.UserProfileUpdateRequest;
import com.example.quizzlet.dto.user.UserSearchResponse;
import com.example.quizzlet.repository.UserRepository;
import com.example.quizzlet.service.UserService;
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

//    @Override
//    public UserProfileResponse getMyProfile(){}
//
//    @Override
//    public UserProfileResponse updateMyProfile(UserProfileUpdateRequest request){}
//
//    @Override
//    public void delete(Long id){}

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
