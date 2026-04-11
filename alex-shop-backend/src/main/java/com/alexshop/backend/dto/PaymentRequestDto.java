package com.alexshop.backend.dto;

import lombok.Data;

@Data
public class PaymentRequestDto {
    private Integer userId;
    private String shippingCountry;
    private String couponCode;
}
