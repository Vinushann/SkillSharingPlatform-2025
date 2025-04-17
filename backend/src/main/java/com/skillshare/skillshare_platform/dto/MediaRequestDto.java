package com.skillshare.skillshare_platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class MediaRequestDto {

    @NotNull(message = "Post ID is required")
    private Long postId;

    @NotBlank(message = "URL is required")
    @Size(max = 255, message = "URL must not exceed 255 characters")
    @Pattern(regexp = "^https?://[\\w-]+(\\.[\\w-]+)+[/#?]?.*$", message = "Invalid URL format")
    private String url;

    @NotBlank(message = "Media type is required")
    @Pattern(regexp = "^(IMAGE|VIDEO)$", message = "Media type must be IMAGE or VIDEO")
    private String mediaType;

    // Getters and Setters
    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }
}