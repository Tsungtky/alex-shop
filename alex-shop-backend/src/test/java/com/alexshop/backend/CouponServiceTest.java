package com.alexshop.backend;

import com.alexshop.backend.entity.Coupon;
import com.alexshop.backend.exception.CouponException;
import com.alexshop.backend.repository.CouponRepository;
import com.alexshop.backend.repository.CouponUsageRepository;
import com.alexshop.backend.service.CouponService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CouponServiceTest {

    @Mock
    CouponRepository couponRepository;

    @Mock
    CouponUsageRepository couponUsageRepository;

    @InjectMocks
    CouponService couponService;

    private Coupon makeCoupon(String type, int value, int minOrder, boolean active, LocalDate expiresAt) {
        Coupon c = new Coupon();
        c.setId(1);
        c.setCode("TEST10");
        c.setType(type);
        c.setValue(value);
        c.setMinOrder(minOrder);
        c.setIsActive(active);
        c.setExpiresAt(expiresAt);
        return c;
    }

    @Test
    void percentDiscountShouldCalculateCorrectly() {
        Coupon coupon = makeCoupon("percent", 20, 100, true, null);
        when(couponRepository.findByCode("TEST10")).thenReturn(coupon);

        int result = couponService.applyCoupon(1000, "TEST10");

        assertThat(result).isEqualTo(800);
    }

    @Test
    void fixedDiscountShouldCalculateCorrectly() {
        Coupon coupon = makeCoupon("fixed", 300, 500, true, null);
        when(couponRepository.findByCode("TEST10")).thenReturn(coupon);

        int result = couponService.applyCoupon(1000, "TEST10");

        assertThat(result).isEqualTo(700);
    }

    @Test
    void couponIsNotActive_shouldThrow() {
        Coupon coupon = makeCoupon("fixed", 300, 500, false, null);
        when(couponRepository.findByCode("TEST10")).thenReturn(coupon);

        assertThatThrownBy(() -> couponService.applyCoupon(1000, "TEST10"))
                .isInstanceOf(CouponException.class)
                .hasMessage("このクーポンは無効です");
    }

    @Test
    void belowMinOrder_shouldThrow() {
        Coupon coupon = makeCoupon("fixed", 300, 4000, true, null);
        when(couponRepository.findByCode("TEST10")).thenReturn(coupon);

        assertThatThrownBy(() -> couponService.applyCoupon(3000, "TEST10"))
                .isInstanceOf(CouponException.class)
                .hasMessage("最低注文金額に達していません");
    }

    @Test
    void couponNotFound_shouldThrow() {
        when(couponRepository.findByCode("TEST10")).thenReturn(null);
        assertThatThrownBy(() -> couponService.applyCoupon(1000, "TEST10"))
                .isInstanceOf(CouponException.class)
                .hasMessage("クーポンが見つかりません");
    }


}
