package com.akash.projects.airBnbApp.dto;

import com.akash.projects.airBnbApp.entity.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    private Long id;
    private Long hotelId;
    private Long roomId;
    private Long userId;
    private Integer roomsCount;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long paymentId;
    private BookingStatus bookingStatus;
    private Set<GuestDto> guests;
}
