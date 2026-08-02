package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.PaymentDto;

import java.math.BigDecimal;

public interface PaymentService {
    PaymentDto createPaymentIntent(BigDecimal amount, String currency);
    PaymentDto confirmPayment(String paymentIntentId);
    PaymentDto getPaymentById(Long paymentId);
}
