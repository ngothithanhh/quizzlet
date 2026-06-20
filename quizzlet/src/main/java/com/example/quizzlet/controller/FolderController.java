package com.example.quizzlet.controller;

import com.example.quizzlet.dto.folder.FolderRequest;
import com.example.quizzlet.dto.folder.FolderResponse;
import com.example.quizzlet.dto.folder.FolderSimpleResponse;
import com.example.quizzlet.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
@RequiredArgsConstructor
public class FolderController {
    private final FolderService folderService;

    @PostMapping("/create")
    public ResponseEntity<FolderResponse> create(@RequestBody FolderRequest request){
        return ResponseEntity.ok(folderService.create(request));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FolderResponse> update(@PathVariable Long id, @RequestBody FolderRequest request){
        return ResponseEntity.ok(folderService.update(id,request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        folderService.delete(id);
        return ResponseEntity.ok("Xóa thành công!");
    }

    @GetMapping("/{folderId}")
    public ResponseEntity<FolderResponse> getById(@PathVariable Long folderId){
        return ResponseEntity.ok(folderService.getById(folderId));
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<FolderSimpleResponse>> getAll(){
        return ResponseEntity.ok(folderService.getMyFolders());
    }

    @PostMapping("/add-studyset/{folderId}/{studySetId}")
    public ResponseEntity<FolderResponse> addStudySet(@PathVariable Long folderId, @PathVariable Long studySetId){
        return ResponseEntity.ok(folderService.addStudySet(folderId,studySetId));
    }

    @DeleteMapping("/delete-studyset/{folderId}/{studySetId}")
    public ResponseEntity<FolderResponse> deleteStudySet(@PathVariable Long folderId, @PathVariable Long studySetId){
        return ResponseEntity.ok(folderService.removeStudySet(folderId,studySetId));
    }
}
