package com.skillshare.skillshare_platform.service;

import com.skillshare.skillshare_platform.dto.ProgressUpdateRequest;
import com.skillshare.skillshare_platform.dto.ProgressUpdateResponse;
import com.skillshare.skillshare_platform.entity.ProgressUpdate;
import com.skillshare.skillshare_platform.repository.ProgressUpdateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressUpdateService {

    private final ProgressUpdateRepository repository;

    public ProgressUpdateResponse create(ProgressUpdateRequest request) {
        ProgressUpdate update = ProgressUpdate.builder()
                .userId(request.getUserId())
                .title(request.getTitle())
                .description(request.getDescription())
                .mediaUrl(request.getMediaUrl())
                .createdAt(LocalDateTime.now())
                .build();

        ProgressUpdate saved = repository.save(update);
        return mapToResponse(saved);
    }

    public List<ProgressUpdateResponse> getAll() {
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProgressUpdateResponse> getByUserId(Long userId) {
        return repository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private ProgressUpdateResponse mapToResponse(ProgressUpdate p) {
        ProgressUpdateResponse res = new ProgressUpdateResponse();
        res.setId(p.getId());
        res.setUserId(p.getUserId());
        res.setTitle(p.getTitle());
        res.setDescription(p.getDescription());
        res.setMediaUrl(p.getMediaUrl());
        res.setCreatedAt(p.getCreatedAt());
        return res;
    }
}
