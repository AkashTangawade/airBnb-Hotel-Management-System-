package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.HotelDto;
import com.akash.projects.airBnbApp.entity.Hotel;
import com.akash.projects.airBnbApp.entity.Inventory;
import com.akash.projects.airBnbApp.entity.Room;
import com.akash.projects.airBnbApp.exception.ResourceNotFoundException;
import com.akash.projects.airBnbApp.repository.HotelRepository;
import com.akash.projects.airBnbApp.repository.InventoryRepository;
import com.akash.projects.airBnbApp.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService{

    private final HotelRepository hotelRepository;
    private final ModelMapper modelMapper;
    private final InventoryRepository inventoryRepository;
    private final RoomRepository roomRepository;

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

        // Delete future inventories for this hotel
        inventoryRepository.deleteByHotelId(id);
        
        hotelRepository.deleteById(id);
        log.info("Hotel and its inventories deleted successfully with ID: {}", id);
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
        hotelRepository.save(hotel);

        // Create inventory for all the rooms for this hotel for the next 365 days
        List<Room> rooms = roomRepository.findByHotelId(hotelId);
        LocalDate today = LocalDate.now();
        
        for (Room room : rooms) {
            for (int i = 0; i < 365; i++) {
                LocalDate date = today.plusDays(i);
                Inventory inventory = new Inventory();
                inventory.setHotel(hotel);
                inventory.setRoom(room);
                inventory.setDate(date);
                inventory.setBookedCount(0);
                inventory.setTotalCount(room.getTotalCount());
                inventory.setSurgeFactor(BigDecimal.ONE);
                inventory.setPrice(room.getBasePrice());
                inventory.setCity(hotel.getCity());
                inventory.setClosed(false);
                inventoryRepository.save(inventory);
            }
        }
        
        log.info("Hotel activated and inventory created for {} rooms", rooms.size());
    }

}
