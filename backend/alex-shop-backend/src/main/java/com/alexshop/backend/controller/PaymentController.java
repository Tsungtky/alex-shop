package com.alexshop.backend.controller;

import com.alexshop.backend.service.PaymentService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create-payment-intent")
    public String createIntent(@RequestBody Integer amount) throws StripeException {
        return paymentService.createPaymentIntent(amount);
    }
}
