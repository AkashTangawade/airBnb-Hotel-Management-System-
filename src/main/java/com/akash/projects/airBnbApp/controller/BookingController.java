package com.akash.projects.airBnbApp.controller;

import com.akash.projects.airBnbApp.dto.BookingDto;
import com.akash.projects.airBnbApp.dto.BookingRequestDto;
import com.akash.projects.airBnbApp.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingDto> createBooking(@RequestBody BookingRequestDto bookingRequestDto) {
        BookingDto bookingDto = bookingService.createBooking(bookingRequestDto);
        return new ResponseEntity<>(bookingDto, HttpStatus.CREATED);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDto> getBookingById(@PathVariable Long bookingId) {
        BookingDto bookingDto = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(bookingDto);
    }

    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingDto> cancelBooking(@PathVariable Long bookingId) {
        BookingDto bookingDto = bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(bookingDto);
    }
}
