package com.alexshop.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order")
    private List<OrderItem> orderItems;

    private String status;
    private Integer totalAmount;
    private Integer shippingFee;
    private Integer discountAmount;
    private String couponCode;
    private String shippingCountry;
    private LocalDateTime createdAt;
}
