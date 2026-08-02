package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.HotelDto;

import java.math.BigDecimal;
import java.util.List;

public interface SearchService {
    List<HotelDto> searchHotelsByCity(String city);
    List<HotelDto> searchHotelsByName(String name);
    List<HotelDto> searchHotelsWithFilters(String city, BigDecimal minPrice, BigDecimal maxPrice);
    List<HotelDto> getAllActiveHotels();
}
