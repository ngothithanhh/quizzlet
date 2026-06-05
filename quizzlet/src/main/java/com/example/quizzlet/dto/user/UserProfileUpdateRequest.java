package com.example.quizzlet.dto.user;

import lombok.Data;

@Data
public class UserProfileUpdateRequest {
    private String username;
    private String avatarUrl;
}
