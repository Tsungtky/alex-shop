package com.alexshop.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String category;
    private Integer price;
    private Integer stock;
    private String nameZh;
    private String nameEn;
    private String nameJa;
    private Integer weight;
    private BigDecimal rating;
    private LocalDateTime createdAt;
    private String imageUrl;
}
