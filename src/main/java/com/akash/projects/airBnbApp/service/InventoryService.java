package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.InventoryDto;

import java.time.LocalDate;
import java.util.List;

public interface InventoryService {
    InventoryDto createInventory(InventoryDto inventoryDto);
    List<InventoryDto> getInventoryByRoomAndDateRange(Long roomId, LocalDate startDate, LocalDate endDate);
    List<InventoryDto> getAvailableRooms(LocalDate checkIn, LocalDate checkOut, String city);
    void deleteInventory(Long inventoryId);
}
