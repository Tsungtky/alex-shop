package com.alexshop.backend.service;

import com.alexshop.backend.dto.PaymentRequestDto;
import com.alexshop.backend.entity.CartItem;
import com.alexshop.backend.entity.Coupon;
import com.alexshop.backend.repository.CouponRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    private final CartService cartService;
    private final ShippingRateService shippingRateService;
    private final CouponRepository couponRepository;

    public String createPaymentIntent(PaymentRequestDto request) throws StripeException {
        // 1. 算購物車總額
        List<CartItem> cartItems = cartService.getCartByUserId(request.getUserId());
        int itemTotal = cartItems.stream()
                .mapToInt(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        // 2. 算運費
        Integer weight = shippingRateService.calculateTotalWeight(request.getUserId());
        int shippingFee = shippingRateService.calculateShippingFee(request.getShippingCountry(), weight);

        int totalAmount = itemTotal + shippingFee;

        // 3. 算折扣
        int discountAmount = 0;
        String couponCode = request.getCouponCode();
        if (couponCode != null && !couponCode.isBlank()) {
            Coupon coupon = couponRepository.findByCode(couponCode);
            if (coupon != null && coupon.getIsActive() && totalAmount >= coupon.getMinOrder()) {
                if ("percent".equals(coupon.getType())) {
                    discountAmount = totalAmount * coupon.getValue() / 100;
                } else if ("fixed".equals(coupon.getType())) {
                    discountAmount = coupon.getValue();
                } else if ("free_shipping".equals(coupon.getType())) {
                    discountAmount = shippingFee;
                }
            }
        }

        int finalAmount = totalAmount - discountAmount;

        // 4. 建立 Stripe PaymentIntent
        Stripe.apiKey = stripeSecretKey;
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(Long.valueOf(finalAmount))
                .setCurrency("jpy")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();
        PaymentIntent intent = PaymentIntent.create(params);
        return intent.getClientSecret();
    }
}
