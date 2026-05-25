package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.HotelSearchRequestDto;
import com.akash.projects.airBnbApp.dto.HotelSearchResponseDto;
import com.akash.projects.airBnbApp.dto.RoomSearchResponseDto;
import com.akash.projects.airBnbApp.entity.Hotel;
import com.akash.projects.airBnbApp.entity.Room;
import com.akash.projects.airBnbApp.entity.enums.BookingStatus;
import com.akash.projects.airBnbApp.exception.BadRequestException;
import com.akash.projects.airBnbApp.repository.BookingRepository;
import com.akash.projects.airBnbApp.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class HotelSearchServiceImpl implements HotelSearchService {

    private final HotelRepository hotelRepository;
    private final BookingRepository bookingRepository;

    @Override
    @Transactional(readOnly = true)
    public List<HotelSearchResponseDto> searchHotels(HotelSearchRequestDto hotelSearchRequestDto) {
        validateSearchRequest(hotelSearchRequestDto);
        log.info("Searching hotels in city: {}", hotelSearchRequestDto.getCity());

        return hotelRepository.findByCityIgnoreCaseAndIsActiveTrue(hotelSearchRequestDto.getCity())
                .stream()
                .map(hotel -> mapHotelSearchResponse(hotel, hotelSearchRequestDto))
                .filter(searchResponse -> !searchResponse.getRooms().isEmpty())
                .toList();
    }

    private HotelSearchResponseDto mapHotelSearchResponse(Hotel hotel, HotelSearchRequestDto hotelSearchRequestDto) {
        List<RoomSearchResponseDto> rooms = hotel.getRooms()
                .stream()
                .map(room -> mapRoomSearchResponse(room, hotelSearchRequestDto))
                .filter(Objects::nonNull)
                .toList();

        HotelSearchResponseDto hotelSearchResponseDto = new HotelSearchResponseDto();
        hotelSearchResponseDto.setHotelId(hotel.getId());
        hotelSearchResponseDto.setHotelName(hotel.getName());
        hotelSearchResponseDto.setCity(hotel.getCity());
        hotelSearchResponseDto.setPhotos(hotel.getPhotos());
        hotelSearchResponseDto.setAmenities(hotel.getAmenities());
        hotelSearchResponseDto.setRooms(rooms);
        hotelSearchResponseDto.setStartingPrice(getStartingPrice(rooms));
        return hotelSearchResponseDto;
    }

    private RoomSearchResponseDto mapRoomSearchResponse(Room room, HotelSearchRequestDto hotelSearchRequestDto) {
        if (room.getCapacity() < hotelSearchRequestDto.getGuestsCount()) {
            return null;
        }

        Long bookedRoomsCount = bookingRepository.getBookedRoomsCount(
                room.getId(),
                hotelSearchRequestDto.getCheckInDate(),
                hotelSearchRequestDto.getCheckOutDate(),
                BookingStatus.CANCELLED);
        int availableCount = room.getTotalCount() - bookedRoomsCount.intValue();

        if (availableCount < hotelSearchRequestDto.getRoomsCount()) {
            return null;
        }

        RoomSearchResponseDto roomSearchResponseDto = new RoomSearchResponseDto();
        roomSearchResponseDto.setRoomId(room.getId());
        roomSearchResponseDto.setType(room.getType());
        roomSearchResponseDto.setBasePrice(room.getBasePrice());
        roomSearchResponseDto.setPhotos(room.getPhotos());
        roomSearchResponseDto.setAmenities(room.getAmenities());
        roomSearchResponseDto.setTotalCount(room.getTotalCount());
        roomSearchResponseDto.setCapacity(room.getCapacity());
        roomSearchResponseDto.setAvailableCount(availableCount);
        return roomSearchResponseDto;
    }

    private BigDecimal getStartingPrice(List<RoomSearchResponseDto> rooms) {
        return rooms.stream()
                .map(RoomSearchResponseDto::getBasePrice)
                .min(Comparator.naturalOrder())
                .orElse(null);
    }

    private void validateSearchRequest(HotelSearchRequestDto hotelSearchRequestDto) {
        validateDates(hotelSearchRequestDto.getCheckInDate(), hotelSearchRequestDto.getCheckOutDate());
        if (hotelSearchRequestDto.getCity() == null || hotelSearchRequestDto.getCity().isBlank()) {
            throw new BadRequestException("City is required");
        }
        if (hotelSearchRequestDto.getRoomsCount() == null || hotelSearchRequestDto.getRoomsCount() < 1) {
            throw new BadRequestException("Rooms count should be at least 1");
        }
        if (hotelSearchRequestDto.getGuestsCount() == null || hotelSearchRequestDto.getGuestsCount() < 1) {
            throw new BadRequestException("Guests count should be at least 1");
        }
    }

    private void validateDates(LocalDate checkInDate, LocalDate checkOutDate) {
        if (checkInDate == null || checkOutDate == null) {
            throw new BadRequestException("Check-in and check-out dates are required");
        }
        if (!checkOutDate.isAfter(checkInDate)) {
            throw new BadRequestException("Check-out date should be after check-in date");
        }
    }
}
