package com.example.quizzlet.service.impl;

import com.example.quizzlet.service.BrevoEmailService;
import com.example.quizzlet.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final BrevoEmailService brevoEmailService;

    @Override
    public void sendOtp(String to, String otpCode) {
        brevoEmailService.sendEmail(
                to,
                "Ma OTP tu Quizzlet",
                buildOtpHtml("Ma OTP xac thuc tai khoan", otpCode)
        );
    }

    @Override
    public void sendResetPassword(String to, String otpCode) {
        brevoEmailService.sendEmail(
                to,
                "Reset Password Quizzlet",
                buildOtpHtml("Ma OTP dat lai mat khau", otpCode)
        );
    }

    private String buildOtpHtml(String title, String otpCode) {
        return """
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
                    <h2>%s</h2>
                    <p>Ma OTP cua ban la:</p>
                    <div style="font-size: 32px; font-weight: 700; letter-spacing: 6px; margin: 16px 0;">%s</div>
                    <p>Ma nay het han sau 2 phut.</p>
                    <p>Neu ban khong yeu cau ma nay, vui long bo qua email.</p>
                </div>
                """.formatted(title, otpCode);
    }
}
