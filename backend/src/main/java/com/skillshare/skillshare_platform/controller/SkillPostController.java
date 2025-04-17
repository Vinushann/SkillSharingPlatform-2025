package com.skillshare.skillshare_platform.controller;

import com.skillshare.skillshare_platform.dto.SkillPostRequestDto;
import com.skillshare.skillshare_platform.dto.SkillPostResponseDto;
import com.skillshare.skillshare_platform.service.SkillPostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/skill-posts")
public class SkillPostController {

    private final SkillPostService skillPostService;

    @Autowired
    public SkillPostController(SkillPostService skillPostService) {
        this.skillPostService = skillPostService;
    }

    @PostMapping
    public ResponseEntity<SkillPostResponseDto> createSkillPost(@Valid @RequestBody SkillPostRequestDto requestDto) {
        SkillPostResponseDto responseDto = skillPostService.createSkillPost(requestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillPostResponseDto> getSkillPostById(@PathVariable Long id) {
        SkillPostResponseDto responseDto = skillPostService.getSkillPostById(id);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkillPostResponseDto> updateSkillPost(@PathVariable Long id, @Valid @RequestBody SkillPostRequestDto requestDto) {
        SkillPostResponseDto responseDto = skillPostService.updateSkillPost(id, requestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkillPost(@PathVariable Long id) {
        skillPostService.deleteSkillPost(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/getallposts")
    public ResponseEntity<Map<String, Object>> getAllSkillPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = skillPostService.getAllSkillPosts(page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping(params = "userId")
    public ResponseEntity<Map<String, Object>> getSkillPostsByUserId(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = skillPostService.getSkillPostsByUserId(userId, page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}