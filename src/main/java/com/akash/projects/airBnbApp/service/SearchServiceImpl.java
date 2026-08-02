package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.HotelDto;
import com.akash.projects.airBnbApp.entity.Hotel;
import com.akash.projects.airBnbApp.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final HotelRepository hotelRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<HotelDto> searchHotelsByCity(String city) {
        log.info("Searching hotels in city: {}", city);
        return hotelRepository.findByCityContainingIgnoreCaseAndIsActiveTrue(city)
                .stream()
                .map(hotel -> modelMapper.map(hotel, HotelDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<HotelDto> searchHotelsByName(String name) {
        log.info("Searching hotels with name: {}", name);
        return hotelRepository.searchByName(name)
                .stream()
                .map(hotel -> modelMapper.map(hotel, HotelDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<HotelDto> searchHotelsWithFilters(String city, BigDecimal minPrice, BigDecimal maxPrice) {
        log.info("Searching hotels in {} with price range {} - {}", city, minPrice, maxPrice);
        return hotelRepository.searchHotels(city)
                .stream()
                .map(hotel -> modelMapper.map(hotel, HotelDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<HotelDto> getAllActiveHotels() {
        log.info("Fetching all active hotels");
        return hotelRepository.findByIsActiveTrue()
                .stream()
                .map(hotel -> modelMapper.map(hotel, HotelDto.class))
                .collect(Collectors.toList());
    }
}
