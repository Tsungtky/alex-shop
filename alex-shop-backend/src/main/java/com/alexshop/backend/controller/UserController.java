package com.alexshop.backend.controller;

import com.alexshop.backend.dto.LoginRequest;
import com.alexshop.backend.dto.LoginResponse;
import com.alexshop.backend.entity.User;
import com.alexshop.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user){
        return userService.registerUser(user);
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Integer id){
        return userService.getUserById(id);
    }

    @PutMapping
    public User updateUser(@RequestBody User user){
        return userService.updateUser(user);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @PutMapping("/{id}/change-password")
    public void changePassword(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        userService.changePassword(id, body.get("oldPassword"), body.get("newPassword"), token);
    }
}
