package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.BookingDto;

import java.util.List;

public interface BookingService {
    BookingDto createBooking(Long hotelId, Long roomId, BookingDto bookingDto);
    BookingDto getBookingById(Long bookingId);
    List<BookingDto> getAllBookingsForUser();
    void cancelBooking(Long bookingId);
}
