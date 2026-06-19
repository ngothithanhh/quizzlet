package com.example.quizzlet;

import com.example.quizzlet.service.BrevoEmailService;
import com.example.quizzlet.service.impl.EmailServiceImpl;
import org.junit.jupiter.api.Test;

import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class EmailTest {

    @Test
    public void sendOtpUsesBrevoEmailService() {
        BrevoEmailService brevoEmailService = mock(BrevoEmailService.class);
        EmailServiceImpl emailService = new EmailServiceImpl(brevoEmailService);

        emailService.sendOtp("test@example.com", "123456");

        verify(brevoEmailService).sendEmail(
                eq("test@example.com"),
                eq("Ma OTP tu Quizzlet"),
                contains("123456")
        );
    }
}
