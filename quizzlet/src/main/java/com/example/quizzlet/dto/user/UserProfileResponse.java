package com.example.quizzlet.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class UserProfileResponse {
    Long id;
    String username;
    String email;
    String avatarUrl;
    boolean isVerified;
}
