package com.example.quizzlet.controller;

import com.example.quizzlet.dto.study.StudySetResponse;
import com.example.quizzlet.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService favoriteService;

    @PostMapping("/{studySetId}")
    public ResponseEntity<String> add(@PathVariable Long studySetId){
        return ResponseEntity.ok(favoriteService.add(studySetId));
    }

    @DeleteMapping("/{studySetId}")
    public ResponseEntity<String> delete(@PathVariable Long studySetId){
        return ResponseEntity.ok(favoriteService.remove(studySetId));
    }

    @GetMapping("/get-my-farvorites")
    public ResponseEntity<List<StudySetResponse>> getMyFavorites(){
        return ResponseEntity.ok(favoriteService.getMyFavorites());
    }
}
