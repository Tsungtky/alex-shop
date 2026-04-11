package com.alexshop.backend.service;

import com.alexshop.backend.entity.Coupon;
import com.alexshop.backend.repository.CouponRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {
    private final CouponRepository couponRepository;

    public List<Coupon> getAllCoupons(){
        return couponRepository.findAll();
    }

    public Coupon createCoupon(Coupon coupon){
        return couponRepository.save(coupon);
    }

    public Coupon getCouponByCode(String code){
        return couponRepository.findByCode(code);
    }

    public Integer applyCoupon(Integer totalAmount, String code){
        Coupon coupon = getCouponByCode(code);
        if (coupon == null) {
            throw new RuntimeException("Coupon not found");
        }
        
        String type = coupon.getType();

        if(!coupon.getIsActive()){
            throw new RuntimeException("Coupon is not available.");
        }
        if(coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(LocalDate.now())){
            throw new RuntimeException("Coupon has expired.");
        }
        if(totalAmount < coupon.getMinOrder()){
            throw new RuntimeException("Minimum order amount not reached");
        }

        if(type.equals("percent")){
            return totalAmount * (100 - coupon.getValue()) / 100;
        } else if (type.equals("fixed")) {
            return totalAmount - coupon.getValue();
        } else {
            return totalAmount;
        }
    }
}
