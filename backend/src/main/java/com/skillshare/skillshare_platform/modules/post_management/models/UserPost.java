package com.skillshare.skillshare_platform.modules.post_management.models;

import com.skillshare.skillshare_platform.modules.user_management.models.AppUser;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import java.util.*;

@Entity
@Table(name = "user_posts")
public class UserPost {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String caption;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by", nullable = false)
    private AppUser postedBy;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date postedAt;

    @ElementCollection
    @CollectionTable(name = "post_media", joinColumns = @JoinColumn(name = "post_id"))
    private List<PostMedia> media = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "post_reposts", joinColumns = @JoinColumn(name = "post_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<AppUser> repostedBy = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "post_tagged_users", joinColumns = @JoinColumn(name = "post_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<AppUser> taggedUsers = new HashSet<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Like> likes = new HashSet<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        this.postedAt = new Date();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public AppUser getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(AppUser postedBy) {
        this.postedBy = postedBy;
    }

    public Date getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(Date postedAt) {
        this.postedAt = postedAt;
    }

    public List<PostMedia> getMedia() {
        return media;
    }

    public void setMedia(List<PostMedia> media) {
        this.media = media;
    }

    public Set<AppUser> getRepostedBy() {
        return repostedBy;
    }

    public void setRepostedBy(Set<AppUser> repostedBy) {
        this.repostedBy = repostedBy;
    }

    public Set<AppUser> getTaggedUsers() {
        return taggedUsers;
    }

    public void setTaggedUsers(Set<AppUser> taggedUsers) {
        this.taggedUsers = taggedUsers;
    }

    public Set<Like> getLikes() {
        return likes;
    }

    public void setLikes(Set<Like> likes) {
        this.likes = likes;
    }

    public Set<Comment> getComments() {
        return comments;
    }

    public void setComments(Set<Comment> comments) {
        this.comments = comments;
    }

    // Embedded media class
    @Embeddable
    public static class PostMedia {
        private String url;
        private String mediaType; // "image", "video", etc.

        public PostMedia() {
        }

        public PostMedia(String url, String mediaType) {
            this.url = url;
            this.mediaType = mediaType;
        }

        // Getters and Setters
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
}