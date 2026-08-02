package com.akash.projects.airBnbApp.controller;

import com.akash.projects.airBnbApp.advice.ApiResponse;
import com.akash.projects.airBnbApp.dto.PaymentDto;
import com.akash.projects.airBnbApp.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-intent")
    public ResponseEntity<ApiResponse<PaymentDto>> createPaymentIntent(
            @RequestParam BigDecimal amount,
            @RequestParam(defaultValue = "usd") String currency) {
        PaymentDto payment = paymentService.createPaymentIntent(amount, currency);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(payment, "Payment intent created successfully"));
    }

    @PostMapping("/confirm/{paymentIntentId}")
    public ResponseEntity<ApiResponse<PaymentDto>> confirmPayment(@PathVariable String paymentIntentId) {
        PaymentDto payment = paymentService.confirmPayment(paymentIntentId);
        return ResponseEntity.ok(new ApiResponse<>(payment, "Payment confirmed successfully"));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentDto>> getPayment(@PathVariable Long paymentId) {
        PaymentDto payment = paymentService.getPaymentById(paymentId);
        return ResponseEntity.ok(new ApiResponse<>(payment, "Payment fetched successfully"));
    }
}
