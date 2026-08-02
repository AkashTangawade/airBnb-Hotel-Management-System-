package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.BookingDto;
import com.akash.projects.airBnbApp.entity.Booking;
import com.akash.projects.airBnbApp.entity.Hotel;
import com.akash.projects.airBnbApp.entity.Room;
import com.akash.projects.airBnbApp.entity.User;
import com.akash.projects.airBnbApp.entity.enums.BookingStatus;
import com.akash.projects.airBnbApp.exception.ResourceNotFoundException;
import com.akash.projects.airBnbApp.repository.BookingRepository;
import com.akash.projects.airBnbApp.repository.HotelRepository;
import com.akash.projects.airBnbApp.repository.RoomRepository;
import com.akash.projects.airBnbApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public BookingDto createBooking(Long hotelId, Long roomId, BookingDto bookingDto) {
        log.info("Creating booking for hotelId: {}, roomId: {}", hotelId, roomId);
        
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));
        
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));
        
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Booking booking = modelMapper.map(bookingDto, Booking.class);
        booking.setHotel(hotel);
        booking.setRoom(room);
        booking.setUser(user);
        booking.setBookingStatus(BookingStatus.PENDING);
        
        booking = bookingRepository.save(booking);
        log.info("Booking created successfully with ID: {}", booking.getId());
        
        return modelMapper.map(booking, BookingDto.class);
    }

    @Override
    public BookingDto getBookingById(Long bookingId) {
        log.info("Getting booking with ID: {}", bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
        return modelMapper.map(booking, BookingDto.class);
    }

    @Override
    public List<BookingDto> getAllBookingsForUser() {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        log.info("Getting all bookings for user: {}", email);
        return bookingRepository.findByUser(user)
                .stream()
                .map(booking -> modelMapper.map(booking, BookingDto.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId) {
        log.info("Cancelling booking with ID: {}", bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
        
        booking.setBookingStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        log.info("Booking cancelled successfully");
    }
}
