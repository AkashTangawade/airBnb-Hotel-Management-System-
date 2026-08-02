package com.akash.projects.airBnbApp.dto;

import com.akash.projects.airBnbApp.entity.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {
    private Long id;
    private String transactionId;
    private PaymentStatus paymentStatus;
    private BigDecimal amount;
    private String clientSecret;
}
