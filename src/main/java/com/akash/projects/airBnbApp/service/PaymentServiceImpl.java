package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.PaymentDto;
import com.akash.projects.airBnbApp.entity.Payment;
import com.akash.projects.airBnbApp.entity.enums.PaymentStatus;
import com.akash.projects.airBnbApp.exception.ResourceNotFoundException;
import com.akash.projects.airBnbApp.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ModelMapper modelMapper;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    @Override
    public PaymentDto createPaymentIntent(BigDecimal amount, String currency) {
        log.info("Creating payment intent for amount: {} {}", amount, currency);
        
        try {
            long amountInCents = amount.multiply(new BigDecimal("100")).longValue();
            
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency(currency.toLowerCase())
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods
                                    .builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Save payment record
            Payment payment = new Payment();
            payment.setTransactionId(paymentIntent.getId());
            payment.setAmount(amount);
            payment.setPaymentStatus(PaymentStatus.PENDING);
            payment = paymentRepository.save(payment);

            log.info("Payment intent created with ID: {}", paymentIntent.getId());
            
            PaymentDto paymentDto = modelMapper.map(payment, PaymentDto.class);
            paymentDto.setClientSecret(paymentIntent.getClientSecret());
            return paymentDto;

        } catch (StripeException e) {
            log.error("Error creating payment intent: {}", e.getMessage());
            throw new RuntimeException("Failed to create payment intent: " + e.getMessage());
        }
    }

    @Override
    public PaymentDto confirmPayment(String paymentIntentId) {
        log.info("Confirming payment with intent ID: {}", paymentIntentId);
        
        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            
            Payment payment = paymentRepository.findByTransactionId(paymentIntentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

            if ("succeeded".equals(paymentIntent.getStatus())) {
                payment.setPaymentStatus(PaymentStatus.COMPLETED);
            } else {
                payment.setPaymentStatus(PaymentStatus.FAILED);
            }
            
            payment = paymentRepository.save(payment);
            log.info("Payment confirmed with status: {}", payment.getPaymentStatus());
            
            return modelMapper.map(payment, PaymentDto.class);

        } catch (StripeException e) {
            log.error("Error confirming payment: {}", e.getMessage());
            throw new RuntimeException("Failed to confirm payment: " + e.getMessage());
        }
    }

    @Override
    public PaymentDto getPaymentById(Long paymentId) {
        log.info("Getting payment with ID: {}", paymentId);
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));
        return modelMapper.map(payment, PaymentDto.class);
    }
}
