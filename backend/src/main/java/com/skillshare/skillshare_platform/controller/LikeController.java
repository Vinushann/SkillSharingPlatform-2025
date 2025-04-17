package com.skillshare.skillshare_platform.controller;

import com.skillshare.skillshare_platform.dto.LikeRequestDto;
import com.skillshare.skillshare_platform.dto.LikeResponseDto;
import com.skillshare.skillshare_platform.service.LikeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/likes")
public class LikeController {

    private final LikeService likeService;

    @Autowired
    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping
    public ResponseEntity<LikeResponseDto> createLike(@Valid @RequestBody LikeRequestDto likeRequestDto) {
        LikeResponseDto responseDto = likeService.createLike(likeRequestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LikeResponseDto> getLikeById(@PathVariable Long id) {
        LikeResponseDto responseDto = likeService.getLikeById(id);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LikeResponseDto> updateLike(@PathVariable Long id, @Valid @RequestBody LikeRequestDto likeRequestDto) {
        LikeResponseDto responseDto = likeService.updateLike(id, likeRequestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLike(@PathVariable Long id) {
        likeService.deleteLike(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllLikes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = likeService.getAllLikes(page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping(params = "postId")
    public ResponseEntity<Map<String, Object>> getLikesByPostId(
            @RequestParam Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = likeService.getLikesByPostId(postId, page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}