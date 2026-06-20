package com.example.quizzlet.dto.texttospeech;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TextToSpeechResponse {
    private String audioUrl;
}
