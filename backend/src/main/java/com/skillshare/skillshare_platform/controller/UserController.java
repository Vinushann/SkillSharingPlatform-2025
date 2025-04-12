package com.skillshare.skillshare_platform.controller;

import com.skillshare.skillshare_platform.dto.UserDto;
import com.skillshare.skillshare_platform.model.User;
import com.skillshare.skillshare_platform.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/register")
    public UserDto createUser(@RequestBody User user) {
        system.out.println("inside the controller")
        return userService.saveUser(user);
    }

    @GetMapping("/hi")
    public String hello(){
        system.out.println("inside the controller")
        return "hellow";
    }
}