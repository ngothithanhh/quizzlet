package com.example.quizzlet.dto.media;

import com.example.quizzlet.enums.MediaType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MediaUploadResponse {
    private String url;
    private MediaType type;
}
