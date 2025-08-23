package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.HotelDto;
import com.akash.projects.airBnbApp.entity.Hotel;

import java.util.List;

public interface HotelService {

    HotelDto createNewHotel(HotelDto hotelDTO);

    HotelDto getHotelById(Long id);

    HotelDto updateHotelById(Long id, HotelDto hotelDto);

    void deleteHotelById(Long id);

    List<HotelDto> getAllHotels();

    void activateHotel(Long hotelId);
}
