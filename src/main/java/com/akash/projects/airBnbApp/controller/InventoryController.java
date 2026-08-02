package com.akash.projects.airBnbApp.controller;

import com.akash.projects.airBnbApp.advice.ApiResponse;
import com.akash.projects.airBnbApp.dto.InventoryDto;
import com.akash.projects.airBnbApp.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<InventoryDto>> createInventory(@Valid @RequestBody InventoryDto inventoryDto) {
        InventoryDto inventory = inventoryService.createInventory(inventoryDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(inventory, "Inventory created successfully"));
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ApiResponse<List<InventoryDto>>> getInventoryByRoomAndDateRange(
            @PathVariable Long roomId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<InventoryDto> inventories = inventoryService.getInventoryByRoomAndDateRange(roomId, startDate, endDate);
        return ResponseEntity.ok(new ApiResponse<>(inventories, "Inventory fetched successfully"));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<InventoryDto>>> getAvailableRooms(
            @RequestParam LocalDate checkIn,
            @RequestParam LocalDate checkOut,
            @RequestParam String city) {
        List<InventoryDto> inventories = inventoryService.getAvailableRooms(checkIn, checkOut, city);
        return ResponseEntity.ok(new ApiResponse<>(inventories, "Available rooms fetched successfully"));
    }

    @DeleteMapping("/{inventoryId}")
    public ResponseEntity<ApiResponse<Void>> deleteInventory(@PathVariable Long inventoryId) {
        inventoryService.deleteInventory(inventoryId);
        return ResponseEntity.ok(new ApiResponse<>(null, "Inventory deleted successfully"));
    }
}
