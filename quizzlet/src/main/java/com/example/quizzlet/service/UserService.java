package com.example.quizzlet.service;

import com.example.quizzlet.dto.user.UserProfileResponse;
import com.example.quizzlet.dto.user.UserProfileUpdateRequest;
import com.example.quizzlet.dto.user.UserSearchResponse;

import java.util.List;

public interface UserService {
//    UserProfileResponse getMyProfile();
//    UserProfileResponse updateMyProfile(UserProfileUpdateRequest request);
//    void delete(Long id);
    List<UserSearchResponse> search(String query);
}
