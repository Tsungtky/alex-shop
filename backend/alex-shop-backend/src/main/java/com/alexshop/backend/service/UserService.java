package com.alexshop.backend.service;

import com.alexshop.backend.entity.User;
import com.alexshop.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getUserById(Integer userId){
        return userRepository.findById(userId).orElseThrow();
    }

    public User updateUser(User user){
        return userRepository.save(user);
    }

    public User registerUser(User user){
        User existing = userRepository.findByEmail(user.getEmail());
        if(existing != null){
            throw new RuntimeException("Email already exists.");
        }
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
}
