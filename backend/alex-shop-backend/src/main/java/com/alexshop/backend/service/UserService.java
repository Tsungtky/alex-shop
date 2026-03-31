package com.alexshop.backend.service;

import com.alexshop.backend.entity.User;
import com.alexshop.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import com.alexshop.backend.dto.LoginRequest;
import com.alexshop.backend.dto.LoginResponse;
import com.alexshop.backend.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

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
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password.");
        }
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return new LoginResponse(token, user.getId(), user.getUsername());
    }
}
