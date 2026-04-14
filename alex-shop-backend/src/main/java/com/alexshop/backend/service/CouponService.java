package com.alexshop.backend.service;

import com.alexshop.backend.entity.Coupon;
import com.alexshop.backend.repository.CouponRepository;
import com.alexshop.backend.repository.CouponUsageRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {
    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;

    public List<Coupon> getAllCoupons(){
        List<Coupon> coupons = couponRepository.findAll();
        for (Coupon coupon : coupons) {
            if (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(LocalDate.now())) {
                coupon.setIsActive(false);
            }
        }
        return coupons;
    }

    public Coupon createCoupon(Coupon coupon){
        if (couponRepository.findByCode(coupon.getCode()) != null) {
            throw new RuntimeException("このクーポンコードはすでに使用されています");
        }
        return couponRepository.save(coupon);
    }

    public Coupon getCouponByCode(String code){
        Coupon coupon = couponRepository.findByCode(code);
        if (coupon != null && coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(LocalDate.now())) {
            coupon.setIsActive(false);
        }
        return coupon;
    }

    public Coupon updateCoupon(Integer id, Coupon coupon){
        coupon.setId(id);
        if (coupon.getExpiresAt() != null && !coupon.getExpiresAt().isBefore(LocalDate.now())) {
            coupon.setIsActive(true);
        }
        return couponRepository.save(coupon);
    }

    public void deleteCoupon(Integer id){
        couponRepository.deleteById(id);
    }

    public Coupon validateCoupon(String code, Integer userId) {
        Coupon coupon = getCouponByCode(code);
        if (coupon == null) throw new RuntimeException("クーポンが見つかりません");
        if (!coupon.getIsActive()) throw new RuntimeException("このクーポンは無効です");
        if (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(LocalDate.now()))
            throw new RuntimeException("クーポンの有効期限が切れています");
        if (couponUsageRepository.existsByCouponIdAndUserId(coupon.getId(), userId))
            throw new RuntimeException("このクーポンはすでに使用済みです");
        return coupon;
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
