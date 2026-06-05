package com.example.quizzlet.service;

import com.example.quizzlet.enums.OtpType;

public interface OtpService {
    String generateOtp(String email, OtpType type);
    void verifyOtp(String email, String otp);

}
