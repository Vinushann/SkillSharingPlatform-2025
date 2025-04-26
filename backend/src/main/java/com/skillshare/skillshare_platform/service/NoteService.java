package com.skillshare.skillshare_platform.service;


import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;
import com.skillshare.skillshare_platform.repository.NoteRepository;
import com.skillshare.skillshare_platform.entity.Note;


@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository repository;

    public Note create(Note note) {
        return repository.save(note);
    }

    public List<Note> getAll() {
        return repository.findAll();
    }

    public Note update(Long id, Note request) {
        Note note = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        note.setTitle(request.getTitle());
        note.setDescription(request.getDescription());
        note.setTimestamp(request.getTimestamp());
        return repository.save(note);
    }

    public void delete(Long id) {
        Note note = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        repository.delete(note);
    }
}