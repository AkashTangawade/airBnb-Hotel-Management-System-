package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.BookingDto;
import com.akash.projects.airBnbApp.dto.BookingRequestDto;

public interface BookingService {

    BookingDto createBooking(BookingRequestDto bookingRequestDto);

    BookingDto getBookingById(Long bookingId);

    BookingDto cancelBooking(Long bookingId);
}
