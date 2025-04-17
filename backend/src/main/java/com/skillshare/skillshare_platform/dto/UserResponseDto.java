package com.skillshare.skillshare_platform.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class UserResponseDto {

    private Long userId;
    private String username;
    private String email;
    private String profilePicture;
    private String bio;
    private LocalDateTime createdAt;
}