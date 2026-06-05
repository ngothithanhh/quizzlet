package com.example.quizzlet.service;

public interface EmailService {
    void sendOtp(String to, String otpCode);
    void sendResetPassword(String to, String otpCode);
}
