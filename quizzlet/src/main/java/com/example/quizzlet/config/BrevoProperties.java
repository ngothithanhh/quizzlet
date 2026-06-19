package com.example.quizzlet.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "brevo")
public class BrevoProperties {
    private String apiKey;

    private String senderEmail;

    private String senderName;
}
