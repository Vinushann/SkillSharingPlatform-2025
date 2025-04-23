package com.skillshare.skillshare_platform.modules.post_management.services;

import com.skillshare.skillshare_platform.modules.post_management.dtos.UserPostDTOs;
import com.skillshare.skillshare_platform.modules.post_management.models.UserPost;
import com.skillshare.skillshare_platform.modules.post_management.repositories.PostRepository;
import com.skillshare.skillshare_platform.modules.user_management.models.AppUser;
import com.skillshare.skillshare_platform.modules.user_management.repositories.AppUserRepository;
import com.skillshare.skillshare_platform.modules.user_management.services.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final AppUserRepository userService;

    @Autowired
    public PostService(PostRepository postRepository, AppUserRepository userService) {
        this.postRepository = postRepository;
        this.userService = userService;
    }

    /**
     * Create a new post
     */
    @Transactional
    public UserPostDTOs.PostResponse createPost(String userId, UserPostDTOs.PostRequest postRequest) {
        AppUser user = userService.getById(userId);

        UserPost newPost = new UserPost();
        newPost.setCaption(postRequest.getCaption());
        newPost.setPostedBy(user);

        // Convert media DTOs to entity objects
        if (postRequest.getMedia() != null && !postRequest.getMedia().isEmpty()) {
            List<UserPost.PostMedia> mediaList = postRequest.getMedia().stream()
                    .map(mediaDTO -> new UserPost.PostMedia(mediaDTO.getUrl(), mediaDTO.getMediaType()))
                    .collect(Collectors.toList());
            newPost.setMedia(mediaList);
        }

        // Add tagged users if present
        if (postRequest.getTaggedUserIds() != null && !postRequest.getTaggedUserIds().isEmpty()) {
            postRequest.getTaggedUserIds().forEach(taggedUserId -> {
                AppUser taggedUser = userService.getById(taggedUserId);
                newPost.getTaggedUsers().add(taggedUser);
            });
        }

        UserPost savedPost = postRepository.save(newPost);
        return convertToPostResponse(savedPost, userId);
    }

    /**
     * Get a post by ID
     */
    public UserPostDTOs.PostResponse getPostById(String postId, String currentUserId) {
        UserPost post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found with ID: " + postId));

        return convertToPostResponse(post, currentUserId);
    }

    /**
     * Get posts by user ID
     */
    public List<UserPostDTOs.PostResponse> getPostsByUserId(String userId, String currentUserId) {
        List<UserPost> posts = postRepository.findByPostedByIdOrderByPostedAtDesc(userId);

        return posts.stream()
                .map(post -> convertToPostResponse(post, currentUserId))
                .collect(Collectors.toList());
    }

    /**
     * Get all posts
     */
    public List<UserPostDTOs.PostResponse> getAllPosts(String currentUserId) {
        List<UserPost> posts = postRepository.findAll();

        return posts.stream()
                .map(post -> convertToPostResponse(post, currentUserId))
                .collect(Collectors.toList());
    }

    /**
     * Update a post
     */
    @Transactional
    public UserPostDTOs.PostResponse updatePost(String postId, String userId, UserPostDTOs.PostRequest postRequest) {
        UserPost post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found with ID: " + postId));

        // Check if user owns the post
        if (!post.getPostedBy().getId().equals(userId)) {
            throw new IllegalArgumentException("User is not authorized to update this post");
        }

        // Update the post
        post.setCaption(postRequest.getCaption());

        // Update media if provided
        if (postRequest.getMedia() != null) {
            List<UserPost.PostMedia> mediaList = postRequest.getMedia().stream()
                    .map(mediaDTO -> new UserPost.PostMedia(mediaDTO.getUrl(), mediaDTO.getMediaType()))
                    .collect(Collectors.toList());
            post.setMedia(mediaList);
        }

        // Update tagged users if provided
        if (postRequest.getTaggedUserIds() != null) {
            post.getTaggedUsers().clear();
            postRequest.getTaggedUserIds().forEach(taggedUserId -> {
                AppUser taggedUser = userService.getById(taggedUserId);
                post.getTaggedUsers().add(taggedUser);
            });
        }

        UserPost updatedPost = postRepository.save(post);
        return convertToPostResponse(updatedPost, userId);
    }

    /**
     * Delete a post
     */
    @Transactional
    public void deletePost(String postId, String userId) {
        UserPost post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found with ID: " + postId));

        // Check if user owns the post
        if (!post.getPostedBy().getId().equals(userId)) {
            throw new IllegalArgumentException("User is not authorized to delete this post");
        }

        postRepository.delete(post);
    }

    /**
     * Repost a post
     */
    @Transactional
    public UserPostDTOs.PostResponse repostPost(String postId, String userId) {
        UserPost post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found with ID: " + postId));

        AppUser user = userService.getById(userId);

        // Add user to repostedBy list if not already there
        if (!post.getRepostedBy().contains(user)) {
            post.getRepostedBy().add(user);
            postRepository.save(post);
        }

        return convertToPostResponse(post, userId);
    }

    /**
     * Remove a repost
     */
    @Transactional
    public void removeRepost(String postId, String userId) {
        UserPost post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found with ID: " + postId));

        AppUser user = userService.getById(userId);

        post.getRepostedBy().remove(user);
        postRepository.save(post);
    }

    /**
     * Check if a post exists
     */
    public boolean postExists(String postId) {
        return postRepository.existsById(postId);
    }

    /**
     * Convert UserPost entity to PostResponse DTO
     */
    private UserPostDTOs.PostResponse convertToPostResponse(UserPost post, String currentUserId) {
        UserPostDTOs.PostResponse response = new UserPostDTOs.PostResponse();
        response.setId(post.getId());
        response.setCaption(post.getCaption());
        response.setPostedAt(post.getPostedAt());

        // Set posted by user info
        AppUser postedBy = post.getPostedBy();
        UserPostDTOs.UserSummaryDTO postedByDTO = new UserPostDTOs.UserSummaryDTO(
                postedBy.getId(),
                postedBy.getFirstName(),
                postedBy.getLastName(),
                postedBy.getProfileImageUrl()
        );
        response.setPostedBy(postedByDTO);

        // Set media
        if (post.getMedia() != null && !post.getMedia().isEmpty()) {
            List<UserPostDTOs.PostMediaDTO> mediaDTOs = post.getMedia().stream()
                    .map(media -> new UserPostDTOs.PostMediaDTO(media.getUrl(), media.getMediaType()))
                    .collect(Collectors.toList());
            response.setMedia(mediaDTOs);
        } else {
            response.setMedia(new ArrayList<>());
        }

        // Set tagged users
        if (post.getTaggedUsers() != null && !post.getTaggedUsers().isEmpty()) {
            List<UserPostDTOs.UserSummaryDTO> taggedUserDTOs = post.getTaggedUsers().stream()
                    .map(user -> new UserPostDTOs.UserSummaryDTO(
                            user.getId(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getProfileImageUrl()
                    ))
                    .collect(Collectors.toList());
            response.setTaggedUsers(taggedUserDTOs);
        } else {
            response.setTaggedUsers(new ArrayList<>());
        }

        // Set reposted by users
        if (post.getRepostedBy() != null && !post.getRepostedBy().isEmpty()) {
            List<UserPostDTOs.UserSummaryDTO> repostedByDTOs = post.getRepostedBy().stream()
                    .map(user -> new UserPostDTOs.UserSummaryDTO(
                            user.getId(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getProfileImageUrl()
                    ))
                    .collect(Collectors.toList());
            response.setRepostedBy(repostedByDTOs);
        } else {
            response.setRepostedBy(new ArrayList<>());
        }

        // Set like and comment counts
        response.setLikeCount(post.getLikes().size());
        response.setCommentCount(post.getComments().size());

        // Check if current user has liked the post
        boolean likedByCurrentUser = post.getLikes().stream()
                .anyMatch(like -> like.getUser().getId().equals(currentUserId));
        response.setLikedByCurrentUser(likedByCurrentUser);

        return response;
    }
}