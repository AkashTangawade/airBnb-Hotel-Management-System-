package com.akash.projects.airBnbApp.controller;

import com.akash.projects.airBnbApp.dto.HotelSearchRequestDto;
import com.akash.projects.airBnbApp.dto.HotelSearchResponseDto;
import com.akash.projects.airBnbApp.service.HotelSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/hotels")
@RequiredArgsConstructor
public class HotelSearchController {

    private final HotelSearchService hotelSearchService;

    @GetMapping("/search")
    public ResponseEntity<List<HotelSearchResponseDto>> searchHotels(
            @RequestParam String city,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
            @RequestParam(defaultValue = "1") Integer roomsCount,
            @RequestParam(defaultValue = "1") Integer guestsCount) {
        HotelSearchRequestDto hotelSearchRequestDto = new HotelSearchRequestDto();
        hotelSearchRequestDto.setCity(city);
        hotelSearchRequestDto.setCheckInDate(checkInDate);
        hotelSearchRequestDto.setCheckOutDate(checkOutDate);
        hotelSearchRequestDto.setRoomsCount(roomsCount);
        hotelSearchRequestDto.setGuestsCount(guestsCount);
        return ResponseEntity.ok(hotelSearchService.searchHotels(hotelSearchRequestDto));
    }
}
