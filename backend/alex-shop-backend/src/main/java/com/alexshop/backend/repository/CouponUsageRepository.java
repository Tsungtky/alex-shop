package com.alexshop.backend.repository;

import com.alexshop.backend.entity.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponUsageRepository extends JpaRepository<CouponUsage, Integer> {
    boolean existsByCouponIdAndUserId(Integer couponId, Integer userId);
}
