package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.BookingDto;
import com.akash.projects.airBnbApp.dto.BookingRequestDto;
import com.akash.projects.airBnbApp.dto.GuestDto;
import com.akash.projects.airBnbApp.entity.Booking;
import com.akash.projects.airBnbApp.entity.Guest;
import com.akash.projects.airBnbApp.entity.Hotel;
import com.akash.projects.airBnbApp.entity.Room;
import com.akash.projects.airBnbApp.entity.User;
import com.akash.projects.airBnbApp.entity.enums.BookingStatus;
import com.akash.projects.airBnbApp.exception.BadRequestException;
import com.akash.projects.airBnbApp.exception.ResourceNotFoundException;
import com.akash.projects.airBnbApp.repository.BookingRepository;
import com.akash.projects.airBnbApp.repository.GuestRepository;
import com.akash.projects.airBnbApp.repository.HotelRepository;
import com.akash.projects.airBnbApp.repository.RoomRepository;
import com.akash.projects.airBnbApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final GuestRepository guestRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public BookingDto createBooking(BookingRequestDto bookingRequestDto) {
        validateBookingRequest(bookingRequestDto);
        log.info("Creating booking for room ID: {}", bookingRequestDto.getRoomId());

        Hotel hotel = hotelRepository
                .findById(bookingRequestDto.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + bookingRequestDto.getHotelId()));
        if (!hotel.isActive()) {
            throw new BadRequestException("Hotel is not active");
        }

        Room room = roomRepository
                .findById(bookingRequestDto.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + bookingRequestDto.getRoomId()));
        if (room.getHotel().getId() != hotel.getId()) {
            throw new BadRequestException("Room does not belong to the selected hotel");
        }

        User user = userRepository
                .findById(bookingRequestDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + bookingRequestDto.getUserId()));

        Long bookedRoomsCount = bookingRepository.getBookedRoomsCount(
                room.getId(),
                bookingRequestDto.getCheckInDate(),
                bookingRequestDto.getCheckOutDate(),
                BookingStatus.CANCELLED);
        int availableRoomsCount = room.getTotalCount() - bookedRoomsCount.intValue();
        if (availableRoomsCount < bookingRequestDto.getRoomsCount()) {
            throw new BadRequestException("Requested rooms are not available for selected dates");
        }

        Booking booking = new Booking();
        booking.setHotel(hotel);
        booking.setRoom(room);
        booking.setUser(user);
        booking.setRoomsCount(bookingRequestDto.getRoomsCount());
        booking.setCheckInDate(bookingRequestDto.getCheckInDate());
        booking.setCheckOutDate(bookingRequestDto.getCheckOutDate());
        booking.setBookingStatus(BookingStatus.RESERVED);
        booking.setGuests(createGuests(bookingRequestDto.getGuests(), user));

        return mapBookingDto(bookingRepository.save(booking));
    }

    @Override
    @Transactional(readOnly = true)
    public BookingDto getBookingById(Long bookingId) {
        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
        return mapBookingDto(booking);
    }

    @Override
    @Transactional
    public BookingDto cancelBooking(Long bookingId) {
        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
        booking.setBookingStatus(BookingStatus.CANCELLED);
        return mapBookingDto(bookingRepository.save(booking));
    }

    private Set<Guest> createGuests(Set<GuestDto> guestDtos, User user) {
        if (guestDtos == null || guestDtos.isEmpty()) {
            return Collections.emptySet();
        }

        Set<Guest> guests = guestDtos
                .stream()
                .map(guestDto -> {
                    Guest guest = modelMapper.map(guestDto, Guest.class);
                    guest.setId(null);
                    guest.setUser(user);
                    return guest;
                })
                .collect(Collectors.toSet());
        return Set.copyOf(guestRepository.saveAll(guests));
    }

    private BookingDto mapBookingDto(Booking booking) {
        BookingDto bookingDto = new BookingDto();
        bookingDto.setId(booking.getId());
        bookingDto.setHotelId(booking.getHotel().getId());
        bookingDto.setRoomId(booking.getRoom().getId());
        bookingDto.setUserId(booking.getUser().getId());
        bookingDto.setRoomsCount(booking.getRoomsCount());
        bookingDto.setCheckInDate(booking.getCheckInDate());
        bookingDto.setCheckOutDate(booking.getCheckOutDate());
        bookingDto.setCreatedAt(booking.getCreatedAt());
        bookingDto.setUpdatedAt(booking.getUpdatedAt());
        bookingDto.setBookingStatus(booking.getBookingStatus());
        bookingDto.setAmount(calculateBookingAmount(booking));
        bookingDto.setGuests(mapGuestDtos(booking.getGuests()));
        return bookingDto;
    }

    private Set<GuestDto> mapGuestDtos(Set<Guest> guests) {
        if (guests == null) {
            return Collections.emptySet();
        }
        return guests.stream()
                .map(guest -> modelMapper.map(guest, GuestDto.class))
                .collect(Collectors.toSet());
    }

    private BigDecimal calculateBookingAmount(Booking booking) {
        long nights = ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
        return booking.getRoom()
                .getBasePrice()
                .multiply(BigDecimal.valueOf(booking.getRoomsCount()))
                .multiply(BigDecimal.valueOf(nights));
    }

    private void validateBookingRequest(BookingRequestDto bookingRequestDto) {
        if (bookingRequestDto.getHotelId() == null) {
            throw new BadRequestException("Hotel ID is required");
        }
        if (bookingRequestDto.getRoomId() == null) {
            throw new BadRequestException("Room ID is required");
        }
        if (bookingRequestDto.getUserId() == null) {
            throw new BadRequestException("User ID is required");
        }
        validateDates(bookingRequestDto.getCheckInDate(), bookingRequestDto.getCheckOutDate());
        if (bookingRequestDto.getRoomsCount() == null || bookingRequestDto.getRoomsCount() < 1) {
            throw new BadRequestException("Rooms count should be at least 1");
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
