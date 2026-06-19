package com.example.quizzlet.service.impl;

import com.example.quizzlet.config.BrevoProperties;
import com.example.quizzlet.dto.brevo.BrevoEmailRequest;
import com.example.quizzlet.service.BrevoEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BrevoEmailServiceImpl implements BrevoEmailService {
    private final BrevoProperties brevoProperties;

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://api.brevo.com/v3")
            .build();

    @Override
    public void sendEmail(String toEmail, String subject, String htmlContent) {
        validateConfig();

        BrevoEmailRequest request = new BrevoEmailRequest(
                new BrevoEmailRequest.Sender(brevoProperties.getSenderName(), brevoProperties.getSenderEmail()),
                List.of(new BrevoEmailRequest.Recipient(toEmail)),
                subject,
                htmlContent
        );

        restClient.post()
                .uri("/smtp/email")
                .contentType(MediaType.APPLICATION_JSON)
                .header("api-key", brevoProperties.getApiKey())
                .body(request)
                .retrieve()
                .toBodilessEntity();
    }

    private void validateConfig() {
        if (!StringUtils.hasText(brevoProperties.getApiKey())
                || !StringUtils.hasText(brevoProperties.getSenderEmail())
                || !StringUtils.hasText(brevoProperties.getSenderName())) {
            throw new IllegalStateException("Brevo email configuration is missing");
        }
    }
}
