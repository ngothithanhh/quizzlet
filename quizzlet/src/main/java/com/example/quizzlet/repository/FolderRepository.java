package com.example.quizzlet.repository;

import com.example.quizzlet.dto.folder.FolderResponse;
import com.example.quizzlet.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder,Long> {
    List<Folder> findByUserId(Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);

}
