package com.alexshop.backend.controller;

import com.alexshop.backend.entity.Coupon;
import com.alexshop.backend.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {
    private final CouponService couponService;

    @GetMapping
    public List<Coupon> getAllCoupons(){
        return couponService.getAllCoupons();
    }

    @PostMapping
    public Coupon createCoupon(@RequestBody Coupon coupon){
        return couponService.createCoupon(coupon);
    }

    @GetMapping("/{code}")
    public Coupon getCouponByCode(@PathVariable String code){
        return couponService.getCouponByCode(code);
    }

    @GetMapping("/validate")
    public Coupon validateCoupon(@RequestParam String code, @RequestParam Integer userId){
        return couponService.validateCoupon(code, userId);
    }

    @PutMapping("/{id}")
    public Coupon updateCoupon(@PathVariable Integer id, @RequestBody Coupon coupon){
        return couponService.updateCoupon(id, coupon);
    }

    @DeleteMapping("/{id}")
    public void deleteCoupon(@PathVariable Integer id){
        couponService.deleteCoupon(id);
    }
}
