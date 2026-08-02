package com.akash.projects.airBnbApp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDto {
    private Long id;
    private Long hotelId;
    private Long roomId;
    private LocalDate date;
    private Integer bookedCount;
    private Integer totalCount;
    private BigDecimal surgeFactor;
    private BigDecimal price;
    private String city;
    private Boolean closed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
