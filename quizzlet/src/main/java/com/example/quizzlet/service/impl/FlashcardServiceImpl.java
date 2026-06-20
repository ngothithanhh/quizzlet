package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.flashcard.CloneFlashcardsRequest;
import com.example.quizzlet.dto.flashcard.FlashcardRequest;
import com.example.quizzlet.dto.flashcard.FlashcardResponse;
import com.example.quizzlet.entity.Flashcard;
import com.example.quizzlet.entity.FlashcardMedia;
import com.example.quizzlet.entity.StudySet;
import com.example.quizzlet.mapper.FlashcardMapper;
import com.example.quizzlet.mapper.FlashcardMediaMapper;
import com.example.quizzlet.repository.FlashcardRepository;
import com.example.quizzlet.repository.StudySetRepository;
import com.example.quizzlet.service.FlashcardService;
import com.example.quizzlet.ultils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import java.io.ByteArrayOutputStream;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FlashcardServiceImpl implements FlashcardService {

    private final FlashcardRepository flashcardRepository;
    private final StudySetRepository studySetRepository;

    @Override
    public FlashcardResponse create(FlashcardRequest request){
        StudySet studySet = studySetRepository.findById(request.getStudySetId()).orElseThrow(()->new RuntimeException("Không tìm thấy StudySet"));

        Flashcard flashcard = FlashcardMapper.toEntity(request);
        flashcard.setStudySet(studySet);

        if(flashcard.getMediaList() != null){
            for (FlashcardMedia media : flashcard.getMediaList()){
                media.setFlashcard(flashcard);
            }
        }

        return FlashcardMapper.toResponse(flashcardRepository.save(flashcard));

    }

    @Override
    public FlashcardResponse update(Long id, FlashcardRequest request){
        Flashcard flashcard = flashcardRepository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy thẻ"));
        FlashcardMapper.updateEntity(flashcard,request);
        if(request.getMediaList() != null){
            flashcard.getMediaList().clear();

            List<FlashcardMedia> newMedia = request.getMediaList()
                    .stream()
                    .map(req ->{
                        FlashcardMedia m = FlashcardMediaMapper.toEntity(req);
                        m.setFlashcard(flashcard);
                        return m;
                    }).toList();

            flashcard.getMediaList().addAll(newMedia);
        }

        return FlashcardMapper.toResponse(flashcardRepository.save(flashcard));
    }

    @Override
    public void delete(Long id){
        flashcardRepository.deleteById(id);
    }

    @Override
    public List<FlashcardResponse> getFlashcardsByStudySet(Long studySetId){
        return flashcardRepository.findByStudySetId(studySetId)
                .stream()
                .map(FlashcardMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void importFlashcards(Long studySetId, MultipartFile file){
        List<Map<String, String>> data = parseExcel(file);

        StudySet studySet = studySetRepository.findById(studySetId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy StudySet"));

        Integer maxPosition = flashcardRepository
                .findMaxPositionByStudySetId(studySetId);

        int position;
        if(maxPosition != null) position = maxPosition + 1;
        else position = 1;

        List<Flashcard> flashcards = new ArrayList<>();

        for (Map<String, String> row:data){
            String term = row.get("term");
            String definition = row.get("definition");


            if (term == null || term.isBlank()) continue;
            if (definition == null || definition.isBlank()) continue;

            Flashcard fc = Flashcard.builder()
                    .term(term.trim())
                    .definition(definition.trim())
                    .position(position++)
                    .studySet(studySet)
                    .build();

            flashcards.add(fc);
        }

        if (flashcards.isEmpty()) {
            throw new RuntimeException("File không có dữ liệu hợp lệ");
        }


        flashcardRepository.saveAll(flashcards);


    }

    @Override
    @Transactional
    public List<Map<String, String>> parseExcel(MultipartFile file){
        if (file.isEmpty()) throw new RuntimeException("File không được để trống");

        List<Map<String, String>> result = new ArrayList<>();
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;
                String term = formatter.formatCellValue(row.getCell(0)).trim();
                String definition = formatter.formatCellValue(row.getCell(1)).trim();
                if (!term.isBlank() && !definition.isBlank()) {
                    result.add(java.util.Map.of("term", term, "definition", definition));
                }
            }

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi đọc file Excel: " + e.getMessage());
        }
        return result;
    }

    @Override
    @Transactional
    public void cloneFlashcards(CloneFlashcardsRequest request){
        Long userId = SecurityUtils.getCurrentUserId();

        StudySet targetStudySet = studySetRepository.findById(request.getTargetStudySetId()).orElseThrow(()->new RuntimeException("Không tồn tại!"));

        if(!targetStudySet.getUser().getId().equals(userId)){
            throw new RuntimeException("Forbidden: Bạn không có quyền truy cập vào StudySet này!");
        }

        List<Flashcard> sourceFlashcards =new ArrayList<>();

        if(request.getSourceStudySetId() != null){
            StudySet sourceStudySet = studySetRepository.findById(request.getSourceStudySetId())
                    .orElseThrow(() -> new RuntimeException("StudySet nguồn không tồn tại"));

            if (!sourceStudySet.getUser().getId().equals(userId) && !sourceStudySet.getIsPublic()) {
                throw new RuntimeException("Forbidden: Bạn không có quyền sao chép vào tài liệu riêng tư của người khác.");
            }

            sourceFlashcards = flashcardRepository.findByStudySetIdOrderByPositionAsc(sourceStudySet.getId());

        }
        else if(request.getSourceFlashcardIds() != null && !request.getSourceFlashcardIds().isEmpty()){
            List<Flashcard> cards =flashcardRepository.findAllById(request.getSourceFlashcardIds());
            for (Flashcard card : cards){
                StudySet ss =card.getStudySet();
                if (!ss.getUser().getId().equals(userId) && !ss.getIsPublic()) {
                    throw new RuntimeException(
                            "Forbidden: Phát hiện flashcard thuộc StudySet private mà bạn không được phép copy.");
                }
                sourceFlashcards.add(card);
            }

        }
        else {
            throw new RuntimeException("Vui lòng cung cấp sourceStudySetId hoặc mảng sourceFlashcardIds.");
        }

        if(sourceFlashcards.isEmpty()){
            return;
        }

        Integer maxPosition = flashcardRepository.findMaxPositionByStudySetId(targetStudySet.getId());

        int nextPosition;
        if(maxPosition != null) nextPosition = maxPosition+1;
        else nextPosition = 1;

        List<Flashcard> clonedFlashcards = new ArrayList<>();
        for (Flashcard orig : sourceFlashcards) {

            Flashcard newFlashcard = Flashcard.builder()
                    .studySet(targetStudySet)
                    .term(orig.getTerm())
                    .definition(orig.getDefinition())
                    .position(nextPosition++)
                    .build();

            if (orig.getMediaList() != null) {

                List<FlashcardMedia> mediaList = orig.getMediaList().stream()
                        .map(m -> FlashcardMedia.builder()
                                .url(m.getUrl())
                                .type(m.getType())
                                .side(m.getSide())
                                .flashcard(newFlashcard)
                                .build())
                        .toList();

                newFlashcard.setMediaList(mediaList);
            }

            clonedFlashcards.add(newFlashcard);
        }

        flashcardRepository.saveAll(clonedFlashcards);
    }

    @Override
    public byte[] exportFlashcardsToExcel(Long studySetId){
        List<Flashcard> flashcards = flashcardRepository
                .findByStudySetIdOrderByPositionAsc(studySetId);

        if (flashcards.isEmpty()) {
            throw new RuntimeException("Không có dữ liệu để export");
        }

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Flashcards");


            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Term");
            header.createCell(1).setCellValue("Definition");
            header.createCell(2).setCellValue("Position");

            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);

            for (int i = 0; i < 3; i++) {
                header.getCell(i).setCellStyle(headerStyle);
            }

            int rowIdx = 1;

            for (Flashcard fc : flashcards) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(fc.getTerm());
                row.createCell(1).setCellValue(fc.getDefinition());
                row.createCell(2).setCellValue(
                        fc.getPosition() != null ? fc.getPosition() : 0
                );
            }


            for (int i = 0; i < 3; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Lỗi export Excel: " + e.getMessage());
        }
    }

    @Override
    public byte[] downloadTemplate(){
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Template");


            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("term");
            header.createCell(1).setCellValue("definition");
            header.createCell(2).setCellValue("position"); // optional

            // ===== STYLE HEADER =====
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);

            for (int i = 0; i < 3; i++) {
                header.getCell(i).setCellStyle(headerStyle);
            }


            Row sample = sheet.createRow(1);
            sample.createCell(0).setCellValue("Java");
            sample.createCell(1).setCellValue("Ngôn ngữ lập trình");
            sample.createCell(2).setCellValue(1);


            Row guide1 = sheet.createRow(3);
            guide1.createCell(0).setCellValue("Hướng dẫn:");

            Row guide2 = sheet.createRow(4);
            guide2.createCell(0).setCellValue("- term: từ vựng / câu hỏi");

            Row guide3 = sheet.createRow(5);
            guide3.createCell(0).setCellValue("- definition: nghĩa / đáp án");

            Row guide4 = sheet.createRow(6);
            guide4.createCell(0).setCellValue("- position: thứ tự (có thể bỏ trống)");


            for (int i = 0; i < 3; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo template Excel: " + e.getMessage());
        }

    }
}
