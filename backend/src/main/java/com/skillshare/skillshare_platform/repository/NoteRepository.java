package com.skillshare.skillshare_platform.repository;
import com.skillshare.skillshare_platform.entity.Note;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {
}