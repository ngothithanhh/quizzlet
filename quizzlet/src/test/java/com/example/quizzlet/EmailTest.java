package com.example.quizzlet;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@SpringBootTest
public class EmailTest {

    @Autowired
    private JavaMailSender mailSender;

    @Test
    public void testEmailWithoutFrom() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("test@example.com");
        message.setSubject("Test Email Without From");
        message.setText("Test body");
        mailSender.send(message);
    }
}
