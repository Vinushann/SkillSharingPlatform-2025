package com.skillshare.skillshare_platform.controller;

import com.skillshare.skillshare_platform.dto.ProgressUpdateRequest;
import com.skillshare.skillshare_platform.dto.ProgressUpdateResponse;
import com.skillshare.skillshare_platform.service.ProgressUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/progress-updates")
@RequiredArgsConstructor
public class ProgressUpdateController {

    private final ProgressUpdateService service;

    @PostMapping
    public ResponseEntity<ProgressUpdateResponse> create(@RequestBody ProgressUpdateRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @GetMapping
    public ResponseEntity<List<ProgressUpdateResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressUpdateResponse>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getByUserId(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
