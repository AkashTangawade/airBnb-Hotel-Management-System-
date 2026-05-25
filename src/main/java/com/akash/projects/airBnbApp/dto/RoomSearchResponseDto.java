package com.akash.projects.airBnbApp.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RoomSearchResponseDto {

    private Long roomId;
    private String type;
    private BigDecimal basePrice;
    private String[] photos;
    private String[] amenities;
    private Integer totalCount;
    private Integer capacity;
    private Integer availableCount;
}
