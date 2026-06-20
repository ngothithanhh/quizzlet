package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.folder.FolderRequest;
import com.example.quizzlet.dto.folder.FolderResponse;
import com.example.quizzlet.dto.folder.FolderSimpleResponse;
import com.example.quizzlet.entity.Folder;
import com.example.quizzlet.entity.StudySet;
import com.example.quizzlet.entity.User;
import com.example.quizzlet.mapper.FolderMapper;
import com.example.quizzlet.repository.FolderRepository;
import com.example.quizzlet.repository.StudySetRepository;
import com.example.quizzlet.repository.UserRepository;
import com.example.quizzlet.service.FolderService;
import com.example.quizzlet.ultils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FolderServiceImpl implements FolderService {
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;
    private final StudySetRepository studySetRepository;

    @Transactional
    @Override
    public FolderResponse create(FolderRequest request){
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        Folder folder = Folder.builder()
                .name(request.getName())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .studySets(new ArrayList<>())
                .user(user)
                .build();

        return FolderMapper.toResponse(folderRepository.save(folder));
    }

    @Override
    public FolderResponse update(Long id, FolderRequest request){
        Long userId = SecurityUtils.getCurrentUserId();

        if(!folderRepository.existsByIdAndUserId(id, userId)) throw new RuntimeException("Bạn không có quyền sửa thư mục này!");

        Folder folder = folderRepository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy thư mục!"));

        folder.setName(request.getName());
        folder.setUpdatedAt(LocalDateTime.now());

        return FolderMapper.toResponse(folderRepository.save(folder));

    }

    @Override
    public void delete(Long id){
        Long userId = SecurityUtils.getCurrentUserId();

        if(!folderRepository.existsByIdAndUserId(id, userId)) throw new RuntimeException("Bạn không có quyền xóa thư mục này!");

        folderRepository.deleteById(id);
    }

    @Override
    public FolderResponse getById(Long id){
        Long userId = SecurityUtils.getCurrentUserId();

        if (!folderRepository.existsByIdAndUserId(id, userId)) {
            throw new RuntimeException("Bạn không có quyền xem thư mục này!");
        }

        Folder folder = folderRepository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy thư mục!"));

        return FolderMapper.toResponse(folder);

    }

    @Override
    public List<FolderSimpleResponse> getMyFolders(){
        Long userId = SecurityUtils.getCurrentUserId();
        List<Folder> folders = folderRepository.findByUserId(userId);
        return folders.stream()
                .map(FolderMapper::toSimpleResponse)
                .toList();
    }

    @Override
    @Transactional
    public FolderResponse addStudySet(Long folderId, Long studySetId){
        Long userId = SecurityUtils.getCurrentUserId();

        if(!folderRepository.existsByIdAndUserId(folderId,userId)) throw new RuntimeException("Bạn không có quyền sửa thư mục này!");

        Folder folder = folderRepository.findById(folderId).orElseThrow(()->new RuntimeException("Không tìm thấy thư mục!"));

        StudySet studySet = studySetRepository.findById(studySetId).orElseThrow(()->new RuntimeException("Không tìm thấy bộ thẻ!"));

        if(folder.getStudySets() == null) folder.setStudySets(new ArrayList<>());

        if(!folder.getStudySets().contains(studySet)){
            folder.getStudySets().add(studySet);
            folder.setUpdatedAt(LocalDateTime.now());
        }

        return FolderMapper.toResponse(folderRepository.save(folder));
    }

    @Override
    @Transactional
    public FolderResponse removeStudySet(Long folderId, Long studySetId){
        Long userId = SecurityUtils.getCurrentUserId();

        if(!folderRepository.existsByIdAndUserId(folderId,userId)) throw new RuntimeException("Bạn không có quyền xóa thư mục này!");

        Folder folder = folderRepository.findById(folderId).orElseThrow(()->new RuntimeException("Không tìm thấy thư mục!"));

        StudySet studySet = studySetRepository.findById(studySetId).orElseThrow(()->new RuntimeException("Không tìm thấy bộ thẻ!"));

        folder.getStudySets().remove(studySet);
        folder.setUpdatedAt(LocalDateTime.now());

        return FolderMapper.toResponse(folderRepository.save(folder));
    }
}
