package com.example.quizzlet.dto.brevo;

import java.util.List;

public record BrevoEmailRequest(
        Sender sender,
        List<Recipient> to,
        String subject,
        String htmlContent
) {
    public record Sender(String name, String email) {
    }

    public record Recipient(String email) {
    }
}
