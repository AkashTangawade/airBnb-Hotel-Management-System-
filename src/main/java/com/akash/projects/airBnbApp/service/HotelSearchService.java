package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.HotelSearchRequestDto;
import com.akash.projects.airBnbApp.dto.HotelSearchResponseDto;

import java.util.List;

public interface HotelSearchService {

    List<HotelSearchResponseDto> searchHotels(HotelSearchRequestDto hotelSearchRequestDto);
}
