package com.skillshare.skillshare_platform.controller;

import com.skillshare.skillshare_platform.dto.MediaRequestDto;
import com.skillshare.skillshare_platform.dto.MediaResponseDto;
import com.skillshare.skillshare_platform.service.MediaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/media")
public class MediaController {

    private final MediaService mediaService;

    @Autowired
    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @PostMapping
    public ResponseEntity<MediaResponseDto> createMedia(@Valid @RequestBody MediaRequestDto mediaRequestDto) {
        MediaResponseDto responseDto = mediaService.createMedia(mediaRequestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaResponseDto> getMediaById(@PathVariable Long id) {
        MediaResponseDto responseDto = mediaService.getMediaById(id);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MediaResponseDto> updateMedia(@PathVariable Long id, @Valid @RequestBody MediaRequestDto mediaRequestDto) {
        MediaResponseDto responseDto = mediaService.updateMedia(id, mediaRequestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedia(@PathVariable Long id) {
        mediaService.deleteMedia(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllMedia(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = mediaService.getAllMedia(page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping(params = "postId")
    public ResponseEntity<Map<String, Object>> getMediaByPostId(
            @RequestParam Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = mediaService.getMediaByPostId(postId, page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}