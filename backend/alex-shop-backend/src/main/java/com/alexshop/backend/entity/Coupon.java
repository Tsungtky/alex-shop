package com.alexshop.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "coupons")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String code;
    private String type;
    private Integer value;
    private Integer minOrder;
    private Boolean isActive;
    private LocalDate expiresAt;
}
