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
    private final TokenBlacklistService tokenBlacklistService;

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

    public void changePassword(Integer userId, String oldPassword, String newPassword, String token) {
        User user = userRepository.findById(userId).orElseThrow();
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("現在のパスワードが正しくありません");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        long remaining = jwtUtil.getRemainingSeconds(token);
        tokenBlacklistService.blacklist(token, remaining);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password.");
        }
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());
        return new LoginResponse(token, user.getId(), user.getFirstName(), user.getLastName(), user.getRole());
    }
}
