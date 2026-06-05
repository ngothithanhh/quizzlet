package com.example.quizzlet.service;

import com.example.quizzlet.dto.auth.AuthResponse;

public interface AuthService {
    void register(String username, String email, String password);
    void verifyOtp(String email, String otp);
    AuthResponse login(String email, String password);
    AuthResponse refresh(String refreshToken);
    void logout(String refreshToken);
    void forgotPassword(String email);
    void resetPassword(String email, String otp, String newPass);
    void changePassword(String email,String oldPass, String newPass);
}
