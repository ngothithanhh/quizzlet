package com.example.quizzlet.controller;

import com.example.quizzlet.dto.media.MediaUploadResponse;
import com.example.quizzlet.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {
    private final MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<MediaUploadResponse> upload(@RequestParam MultipartFile file) {
        return ResponseEntity.ok(mediaService.upload(file));
    }
}
