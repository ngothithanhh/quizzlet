package com.example.quizzlet.service;

import com.example.quizzlet.dto.folder.FolderRequest;
import com.example.quizzlet.dto.folder.FolderResponse;
import com.example.quizzlet.dto.folder.FolderSimpleResponse;
import com.example.quizzlet.entity.Folder;

import java.util.List;

public interface FolderService {
    FolderResponse create(FolderRequest request);

    FolderResponse update(Long id, FolderRequest request);

    void delete(Long id);

    FolderResponse getById(Long id);

    List<FolderSimpleResponse> getMyFolders();

    FolderResponse addStudySet(Long folderId, Long studySetId);

    FolderResponse removeStudySet(Long folderId, Long studySetId);
}
