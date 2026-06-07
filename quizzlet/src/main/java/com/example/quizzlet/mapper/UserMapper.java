package com.example.quizzlet.mapper;

import com.example.quizzlet.dto.user.UserProfileResponse;
import com.example.quizzlet.entity.User;

public class UserMapper {
    public static UserProfileResponse toResponse(User user){
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .username(user.getUsername())
                .isVerified(user.getIsVerified())
                .build();
    }
}
