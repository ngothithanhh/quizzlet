package com.example.quizzlet.service;

import com.example.quizzlet.dto.media.MediaUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface MediaService {
    MediaUploadResponse upload(MultipartFile file);
}
