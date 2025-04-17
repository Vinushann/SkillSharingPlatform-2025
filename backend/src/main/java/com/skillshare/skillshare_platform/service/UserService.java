package com.skillshare.skillshare_platform.service;

import com.skillshare.skillshare_platform.dto.UserRequestDto;
import com.skillshare.skillshare_platform.dto.UserResponseDto;
import com.skillshare.skillshare_platform.exception.ResourceConflictException;
import com.skillshare.skillshare_platform.exception.ResourceNotFoundException;
import com.skillshare.skillshare_platform.model.User;
import com.skillshare.skillshare_platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // create new user
    public UserResponseDto createUser(UserRequestDto userRequestDto) {
        // Check for duplicate username or email
        if (userRepository.findByUsername(userRequestDto.getUsername()).isPresent()) {
            throw new ResourceConflictException("Username already exists: " + userRequestDto.getUsername());
        }
        if (userRepository.findByEmail(userRequestDto.getEmail()).isPresent()) {
            throw new ResourceConflictException("Email already exists: " + userRequestDto.getEmail());
        }

        // Map DTO to entity
        User user = new User();
        user.setUsername(userRequestDto.getUsername());
        user.setEmail(userRequestDto.getEmail());
        user.setProfilePicture(userRequestDto.getProfilePicture());
        user.setBio(userRequestDto.getBio());

        // Save and map to response
        User savedUser = userRepository.save(user);
        return mapToResponseDto(savedUser);
    }

    // get the user by id
    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return mapToResponseDto(user);
    }

    // update the user
    public UserResponseDto updateUser(Long id, UserRequestDto userRequestDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        // Check for duplicate username or email (excluding current user)
        userRepository.findByUsername(userRequestDto.getUsername())
                .ifPresent(existing -> {
                    if (!existing.getUserId().equals(id)) {
                        throw new ResourceConflictException("Username already exists: " + userRequestDto.getUsername());
                    }
                });

        userRepository.findByEmail(userRequestDto.getEmail())
                .ifPresent(existing -> {
                    if (!existing.getUserId().equals(id)) {
                        throw new ResourceConflictException("Email already exists: " + userRequestDto.getEmail());
                    }
                });

        // Update fields
        user.setUsername(userRequestDto.getUsername());
        user.setEmail(userRequestDto.getEmail());
        user.setProfilePicture(userRequestDto.getProfilePicture());
        user.setBio(userRequestDto.getBio());

        // Save and map to response
        User updatedUser = userRepository.save(user);
        return mapToResponseDto(updatedUser);
    }

    // delete the user
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }

    // binding the returned obj with responseDto
    private UserResponseDto mapToResponseDto(User user) {
        UserResponseDto responseDto = new UserResponseDto();
        responseDto.setUserId(user.getUserId());
        responseDto.setUsername(user.getUsername());
        responseDto.setEmail(user.getEmail());
        responseDto.setProfilePicture(user.getProfilePicture());
        responseDto.setBio(user.getBio());
        responseDto.setCreatedAt(user.getCreatedAt());
        return responseDto;
    }

    public List<UserResponseDto> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.findAll(pageable);
        return userPage.getContent().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
}