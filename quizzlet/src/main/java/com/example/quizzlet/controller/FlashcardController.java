package com.example.quizzlet.controller;

import com.example.quizzlet.dto.flashcard.CloneFlashcardsRequest;
import com.example.quizzlet.dto.flashcard.FlashcardRequest;
import com.example.quizzlet.dto.flashcard.FlashcardResponse;
import com.example.quizzlet.service.FlashcardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flashcards")
@RequiredArgsConstructor
public class FlashcardController {
    private final FlashcardService flashcardService;

    @PostMapping("/create")
    public ResponseEntity<FlashcardResponse> create(@RequestBody FlashcardRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(flashcardService.create(request));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FlashcardResponse> updateFlashcard(
            @PathVariable Long id,
            @Valid @RequestBody FlashcardRequest request) {
        return ResponseEntity.ok(flashcardService.update(id, request));
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFlashcard(@PathVariable Long id) {
        flashcardService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-studyset/{studySetId}")
    public ResponseEntity<List<FlashcardResponse>> getFlashcardsByStudySet(@PathVariable Long studySetId) {
        return ResponseEntity.ok(flashcardService.getFlashcardsByStudySet(studySetId));
    }

    @PostMapping("/clone")
    public ResponseEntity<Map<String, String>> cloneFlashcards(@Valid @RequestBody CloneFlashcardsRequest request) {
        flashcardService.cloneFlashcards(request);
        return ResponseEntity.ok(Map.of("message", "Sao chép flashcards thành công"));
    }

    @PostMapping("/import/{studySetId}")
    public ResponseEntity<Map<String, String>> importFlashcards(@PathVariable Long studySetId, @RequestParam("file")MultipartFile file){
        flashcardService.importFlashcards(studySetId,file);
        return ResponseEntity.ok(Map.of("message","Thêm các thẻ từ file thành công!"));
    }

    @GetMapping("/export/{studySetId}")
    public ResponseEntity<byte[]> exportFlashcards(@PathVariable Long studySetId) {
        byte[] excelBytes = flashcardService.exportFlashcardsToExcel(studySetId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "flashcards_" + studySetId + ".xlsx");

        return ResponseEntity.ok().headers(headers).body(excelBytes);
    }

    @GetMapping("/template")
    public ResponseEntity<byte[]> downloadTemplate() {
        byte[] excelBytes = flashcardService.downloadTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "flashcards_template.xlsx");
        return ResponseEntity.ok().headers(headers).body(excelBytes);
    }
}
