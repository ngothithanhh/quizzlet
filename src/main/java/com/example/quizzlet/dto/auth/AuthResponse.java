package com.example.quizzlet.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
}
