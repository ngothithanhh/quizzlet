package com.example.quizzlet.service;

import com.example.quizzlet.entity.RefreshToken;
import com.example.quizzlet.entity.User;

public interface RefreshTokenService {
    RefreshToken createToken(User user);
    RefreshToken verify(String token);
    void revoke(String token);
}
