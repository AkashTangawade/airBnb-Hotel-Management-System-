package com.akash.projects.airBnbApp.controller;

import com.akash.projects.airBnbApp.advice.ApiResponse;
import com.akash.projects.airBnbApp.dto.HotelDto;
import com.akash.projects.airBnbApp.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/hotels/city/{city}")
    public ResponseEntity<ApiResponse<List<HotelDto>>> searchByCity(@PathVariable String city) {
        List<HotelDto> hotels = searchService.searchHotelsByCity(city);
        return ResponseEntity.ok(new ApiResponse<>(hotels, "Hotels found successfully"));
    }

    @GetMapping("/hotels/name/{name}")
    public ResponseEntity<ApiResponse<List<HotelDto>>> searchByName(@PathVariable String name) {
        List<HotelDto> hotels = searchService.searchHotelsByName(name);
        return ResponseEntity.ok(new ApiResponse<>(hotels, "Hotels found successfully"));
    }

    @GetMapping("/hotels")
    public ResponseEntity<ApiResponse<List<HotelDto>>> searchWithFilters(
            @RequestParam String city,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        if (minPrice == null) minPrice = BigDecimal.ZERO;
        if (maxPrice == null) maxPrice = new BigDecimal("1000000");
        List<HotelDto> hotels = searchService.searchHotelsWithFilters(city, minPrice, maxPrice);
        return ResponseEntity.ok(new ApiResponse<>(hotels, "Hotels found successfully"));
    }

    @GetMapping("/hotels/active")
    public ResponseEntity<ApiResponse<List<HotelDto>>> getAllActiveHotels() {
        List<HotelDto> hotels = searchService.getAllActiveHotels();
        return ResponseEntity.ok(new ApiResponse<>(hotels, "Active hotels fetched successfully"));
    }
}
