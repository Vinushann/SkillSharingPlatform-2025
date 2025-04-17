package com.skillshare.skillshare_platform.controller;

import com.skillshare.skillshare_platform.dto.FollowRequestDto;
import com.skillshare.skillshare_platform.dto.FollowResponseDto;
import com.skillshare.skillshare_platform.service.FollowService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/follows")
public class FollowController {

    private final FollowService followService;

    @Autowired
    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @PostMapping
    public ResponseEntity<FollowResponseDto> createFollow(@Valid @RequestBody FollowRequestDto followRequestDto) {
        FollowResponseDto responseDto = followService.createFollow(followRequestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FollowResponseDto> getFollowById(@PathVariable Long id) {
        FollowResponseDto responseDto = followService.getFollowById(id);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FollowResponseDto> updateFollow(@PathVariable Long id, @Valid @RequestBody FollowRequestDto followRequestDto) {
        FollowResponseDto responseDto = followService.updateFollow(id, followRequestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFollow(@PathVariable Long id) {
        followService.deleteFollow(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<List<FollowResponseDto>> getAllFollows(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<FollowResponseDto> follows = followService.getAllFollows(page, size);
        return new ResponseEntity<>(follows, HttpStatus.OK);
    }
}