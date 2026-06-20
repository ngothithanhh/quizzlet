package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.texttospeech.TextToSpeechRequest;
import com.example.quizzlet.dto.texttospeech.TextToSpeechResponse;
import com.example.quizzlet.service.LanguageDetectService;
import com.example.quizzlet.service.TextToSpeechService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TextToSpeechServiceImpl implements TextToSpeechService {

    private final LanguageDetectService languageDetectService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public TextToSpeechResponse synthesize(TextToSpeechRequest request) {
        if (request.getText() == null || request.getText().isBlank()) {
            throw new RuntimeException("Text không được để trống!");
        }

        String languageCode = request.getLanguageCode();
        if (languageCode == null || languageCode.isBlank() || "auto".equalsIgnoreCase(languageCode)) {
            languageCode = languageDetectService.detect(request.getText());
        }

        String url = UriComponentsBuilder
                .fromHttpUrl("https://translate.google.com/translate_tts")
                .queryParam("ie", "UTF-8")
                .queryParam("q", request.getText())
                .queryParam("tl", languageCode)
                .queryParam("client", "tw-ob")
                .toUriString();

        byte[] audioBytes = restTemplate.getForObject(url, byte[].class);

        if (audioBytes == null || audioBytes.length == 0) {
            throw new RuntimeException("Không tạo được audio!");
        }

        try {
            Path uploadDir = Path.of("uploads", "tts");
            Files.createDirectories(uploadDir);

            String fileName = UUID.randomUUID() + ".mp3";
            Path filePath = uploadDir.resolve(fileName);

            Files.write(filePath, audioBytes);

            return TextToSpeechResponse.builder()
                    .audioUrl("/uploads/tts/" + fileName)
                    .build();

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu file audio!", e);
        }
    }

}
