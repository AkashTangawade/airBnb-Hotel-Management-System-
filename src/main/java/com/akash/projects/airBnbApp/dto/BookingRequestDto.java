package com.akash.projects.airBnbApp.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class BookingRequestDto {

    private Long hotelId;
    private Long roomId;
    private Long userId;
    private Integer roomsCount;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Set<GuestDto> guests;
}
