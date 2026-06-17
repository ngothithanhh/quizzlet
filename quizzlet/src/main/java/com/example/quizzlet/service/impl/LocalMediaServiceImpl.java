package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.media.MediaUploadResponse;
import com.example.quizzlet.enums.MediaType;
import com.example.quizzlet.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalMediaServiceImpl implements MediaService {

    private static final long MAX_FILE_SIZE = 25 * 1024 * 1024; // 20MB

    @Override
    public MediaUploadResponse upload(MultipartFile file){

        validateFile(file);

        String contentType = file.getContentType();
        MediaType mediaType = detectMediaType(contentType);
        String folder = mediaType == MediaType.IMAGE ? "images" : "audios";

        String fileName = buildFileName(file.getOriginalFilename());
        Path uploadDir = Paths.get("uploads",folder);

        try {
            Files.createDirectories(uploadDir);

            Path filePath = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String url = "/quizzlet/uploads/" + folder + "/" + fileName;

            return MediaUploadResponse.builder()
                    .url(url)
                    .type(mediaType)
                    .build();

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu file: " + e.getMessage());
        }
    }


    private void validateFile(MultipartFile file) {

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File không được vượt quá 25MB");
        }

        String contentType = file.getContentType();
        if (!isAllowedContentType(contentType)) {
            throw new RuntimeException("Chỉ cho phép upload ảnh hoặc âm thanh");
        }
    }

    private MediaType detectMediaType(String contentType) {
        if (contentType != null && contentType.startsWith("image/")) {
            return MediaType.IMAGE;
        }

        if (contentType != null && contentType.startsWith("audio/")) {
            return MediaType.AUDIO;
        }

        throw new RuntimeException("Không xác định được loại media! ");
    }

    private boolean isAllowedContentType(String contentType) {
        return contentType != null && (
                contentType.equals("image/jpeg") ||
                        contentType.equals("image/png") ||
                        contentType.equals("image/webp") ||
                        contentType.equals("audio/mpeg") ||
                        contentType.equals("audio/wav") ||
                        contentType.equals("audio/ogg") ||
                        contentType.equals("audio/mp4")
        );
    }

    private String buildFileName(String originalFilename) {
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        return UUID.randomUUID() + extension;
    }
}
