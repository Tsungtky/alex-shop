package com.alexshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Integer userId;
    private String firstName;
    private String lastName;
    private String role;
}
