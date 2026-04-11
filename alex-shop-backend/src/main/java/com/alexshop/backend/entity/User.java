package com.alexshop.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String firstName;
    private String lastName;
    private String gender;
    private LocalDate birthday;
    private String phoneCountryCode;
    private String phone;
    private String country;
    private String address;
    private String apartment;
    private String city;
    private String state;
    private String postalCode;
    private String email;
    private String password;
    private LocalDateTime createdAt;
    private String role;
}
