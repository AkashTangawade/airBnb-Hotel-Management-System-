package com.akash.projects.airBnbApp.controller;

import com.akash.projects.airBnbApp.advice.ApiResponse;
import com.akash.projects.airBnbApp.dto.BookingDto;
import com.akash.projects.airBnbApp.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/hotels/{hotelId}/rooms/{roomId}")
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(
            @PathVariable Long hotelId,
            @PathVariable Long roomId,
            @Valid @RequestBody BookingDto bookingDto) {
        BookingDto booking = bookingService.createBooking(hotelId, roomId, bookingDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(booking, "Booking created successfully"));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<BookingDto>> getBooking(@PathVariable Long bookingId) {
        BookingDto booking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(new ApiResponse<>(booking, "Booking fetched successfully"));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getMyBookings() {
        List<BookingDto> bookings = bookingService.getAllBookingsForUser();
        return ResponseEntity.ok(new ApiResponse<>(bookings, "Bookings fetched successfully"));
    }

    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(new ApiResponse<>(null, "Booking cancelled successfully"));
    }
}
