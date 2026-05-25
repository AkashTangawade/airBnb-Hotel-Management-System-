package com.akash.projects.airBnbApp.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class HotelSearchResponseDto {

    private Long hotelId;
    private String hotelName;
    private String city;
    private String[] photos;
    private String[] amenities;
    private List<RoomSearchResponseDto> rooms;
    private BigDecimal startingPrice;
}
