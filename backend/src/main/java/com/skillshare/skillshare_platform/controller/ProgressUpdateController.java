package com.skillshare.skillshare_platform.controller;

import com.skillshare.skillshare_platform.dto.ProgressUpdateRequestDto;
import com.skillshare.skillshare_platform.dto.ProgressUpdateResponseDto;
import com.skillshare.skillshare_platform.service.ProgressUpdateService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/progress-updates")
public class ProgressUpdateController {

    private final ProgressUpdateService progressUpdateService;

    @Autowired
    public ProgressUpdateController(ProgressUpdateService progressUpdateService) {
        this.progressUpdateService = progressUpdateService;
    }

    @PostMapping
    public ResponseEntity<ProgressUpdateResponseDto> createProgressUpdate(@Valid @RequestBody ProgressUpdateRequestDto requestDto) {
        ProgressUpdateResponseDto responseDto = progressUpdateService.createProgressUpdate(requestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgressUpdateResponseDto> getProgressUpdateById(@PathVariable Long id) {
        ProgressUpdateResponseDto responseDto = progressUpdateService.getProgressUpdateById(id);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProgressUpdateResponseDto> updateProgressUpdate(@PathVariable Long id, @Valid @RequestBody ProgressUpdateRequestDto requestDto) {
        ProgressUpdateResponseDto responseDto = progressUpdateService.updateProgressUpdate(id, requestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgressUpdate(@PathVariable Long id) {
        progressUpdateService.deleteProgressUpdate(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProgressUpdates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = progressUpdateService.getAllProgressUpdates(page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping(params = "userId")
    public ResponseEntity<Map<String, Object>> getProgressUpdatesByUserId(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = progressUpdateService.getProgressUpdatesByUserId(userId, page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/templates")
    public ResponseEntity<List<String>> getTemplateTypes() {
        List<String> templates = progressUpdateService.getTemplateTypes();
        return new ResponseEntity<>(templates, HttpStatus.OK);
    }

    @GetMapping("/templates/{templateType}/fields")
    public ResponseEntity<List<String>> getTemplateFields(@PathVariable String templateType) {
        List<String> fields = progressUpdateService.getTemplateFields(templateType);
        return new ResponseEntity<>(fields, HttpStatus.OK);
    }
}