package com.alexshop.backend.controller;

import com.alexshop.backend.entity.Coupon;
import com.alexshop.backend.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {
    private final CouponService couponService;

    @GetMapping("/{code}")
    public Coupon getCouponByCode(@PathVariable String code){
        return couponService.getCouponByCode(code);
    }
}
