package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.InventoryDto;
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

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final ModelMapper modelMapper;

    @Override
    public InventoryDto createInventory(InventoryDto inventoryDto) {
        log.info("Creating inventory for roomId: {}, date: {}", inventoryDto.getRoomId(), inventoryDto.getDate());
        
        Hotel hotel = hotelRepository.findById(inventoryDto.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + inventoryDto.getHotelId()));
        
        Room room = roomRepository.findById(inventoryDto.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + inventoryDto.getRoomId()));

        Inventory inventory = modelMapper.map(inventoryDto, Inventory.class);
        inventory.setHotel(hotel);
        inventory.setRoom(room);
        
        inventory = inventoryRepository.save(inventory);
        log.info("Inventory created successfully with ID: {}", inventory.getId());
        
        return modelMapper.map(inventory, InventoryDto.class);
    }

    @Override
    public List<InventoryDto> getInventoryByRoomAndDateRange(Long roomId, LocalDate startDate, LocalDate endDate) {
        log.info("Getting inventory for roomId: {} between {} and {}", roomId, startDate, endDate);
        
        return inventoryRepository.findByRoomIdAndDateBetween(roomId, startDate, endDate)
                .stream()
                .map(inventory -> modelMapper.map(inventory, InventoryDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryDto> getAvailableRooms(LocalDate checkIn, LocalDate checkOut, String city) {
        log.info("Searching available rooms in {} from {} to {}", city, checkIn, checkOut);
        
        List<Inventory> availableInventories = inventoryRepository
                .findByCityAndDateBetweenAndClosedFalseAndBookedCountLessThanTotalCount(
                        city, checkIn, checkOut);
        
        return availableInventories.stream()
                .map(inventory -> modelMapper.map(inventory, InventoryDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteInventory(Long inventoryId) {
        log.info("Deleting inventory with ID: {}", inventoryId);
        if (!inventoryRepository.existsById(inventoryId)) {
            throw new ResourceNotFoundException("Inventory not found with ID: " + inventoryId);
        }
        inventoryRepository.deleteById(inventoryId);
        log.info("Inventory deleted successfully");
    }
}
