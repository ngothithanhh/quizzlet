package com.example.quizzlet.service;

import com.example.quizzlet.dto.texttospeech.TextToSpeechRequest;
import com.example.quizzlet.dto.texttospeech.TextToSpeechResponse;

public interface TextToSpeechService {
    TextToSpeechResponse synthesize(TextToSpeechRequest request);

}
