package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.HotelDto;
import com.akash.projects.airBnbApp.entity.Hotel;
import com.akash.projects.airBnbApp.exception.ResourceNotFoundException;
import com.akash.projects.airBnbApp.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService{

    private final HotelRepository hotelRepository;
    private final ModelMapper modelMapper;

    @Override
    public HotelDto createNewHotel(HotelDto hotelDto) {
        log.info("creating a new hotel with name: {}", hotelDto.getName());
        Hotel hotel=modelMapper.map(hotelDto, Hotel.class);
        hotel.setActive(false);
        hotel= hotelRepository.save(hotel);
        log.info("created a new hotel with ID: {}", hotelDto.getId());
        return modelMapper.map(hotel, HotelDto.class);
    }

    @Override
    public HotelDto getHotelById(Long id) {
        log.info("Getting the hotel with ID: {}", id);
        Hotel hotel=hotelRepository
                .findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Hotel not found with ID:"+id));
        return modelMapper.map(hotel, HotelDto.class);
    }

    @Override
    public HotelDto updateHotelById(Long id, HotelDto hotelDto) {
        log.info("Getting the hotel with ID: {}", id);
        Hotel hotel=hotelRepository
                .findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Hotel not found with ID:"+id));
        modelMapper.map(hotelDto, hotel);
        hotel.setId(id);
        hotel = hotelRepository.save(hotel);
        return modelMapper.map(hotel, HotelDto.class);
    }

    @Override
    public void deleteHotelById(Long id) {
        Boolean hotelExist=hotelRepository.existsById(id);
        if(!hotelExist) throw new ResourceNotFoundException("Hotel not found with ID"+ id);

        hotelRepository.deleteById(id);
        //TODO: Delete the future inventories for this hotel

    }

    @Override
    public List<HotelDto> getAllHotels() {
        log.info("Fetching all hotels");
        return hotelRepository
                .findAll()
                .stream()
                .map((element) -> modelMapper.map(element, HotelDto.class)).collect(Collectors.toList());
    }

    @Override
    public void activateHotel(Long hotelId) {
        log.info("Activating hotel with ID: {}", hotelId);
        Hotel hotel=hotelRepository
                .findById(hotelId)
                .orElseThrow(()->new ResourceNotFoundException("Hotel not found with ID"+hotelId));

        hotel.setActive(true);
        //TODO: create inventory for all the rooms for this hotel
    }

}
