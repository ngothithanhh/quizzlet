package com.example.quizzlet.controller;

import com.example.quizzlet.dto.texttospeech.TextToSpeechRequest;
import com.example.quizzlet.dto.texttospeech.TextToSpeechResponse;
import com.example.quizzlet.service.TextToSpeechService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tts")
@RequiredArgsConstructor
public class TextToSpeechController {
    private final TextToSpeechService textToSpeechService;

    @PostMapping
    public ResponseEntity<TextToSpeechResponse> synthesize(@RequestBody TextToSpeechRequest request) {
        return ResponseEntity.ok(textToSpeechService.synthesize(request));
    }
}
