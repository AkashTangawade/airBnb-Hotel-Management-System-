package com.akash.projects.airBnbApp.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class HotelSearchRequestDto {

    private String city;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer roomsCount;
    private Integer guestsCount;
}
