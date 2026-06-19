package com.example.quizzlet.service;

public interface BrevoEmailService {
    void sendEmail(String toEmail, String subject, String htmlContent);
}
