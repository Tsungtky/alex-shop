package com.alexshop.backend.service;

import com.alexshop.backend.entity.Coupon;
import com.alexshop.backend.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CouponService {
    private final CouponRepository couponRepository;

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
