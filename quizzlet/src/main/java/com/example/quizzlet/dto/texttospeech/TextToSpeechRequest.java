package com.example.quizzlet.dto.texttospeech;

import lombok.Data;

@Data
public class TextToSpeechRequest {
    private String text;
    private String languageCode; // ví dụ: "vi-VN", "en-US", "ja-JP"
    private String voiceName;
}
