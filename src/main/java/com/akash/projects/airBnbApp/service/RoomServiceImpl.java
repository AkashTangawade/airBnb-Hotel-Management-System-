package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.RoomDto;
import com.akash.projects.airBnbApp.entity.Hotel;
import com.akash.projects.airBnbApp.entity.Room;
import com.akash.projects.airBnbApp.exception.ResourceNotFoundException;
import com.akash.projects.airBnbApp.repository.HotelRepository;
import com.akash.projects.airBnbApp.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
public class RoomServiceImpl implements RoomService{

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final ModelMapper modelMapper;


    @Override
    public RoomDto createNewRoom(Long hotelId, RoomDto roomDto) {
        log.info("Creating a new room in hotel with ID: {}", hotelId);
        Hotel hotel=hotelRepository
                .findById(hotelId)
                .orElseThrow(()->new ResourceNotFoundException("Hotel not found with ID"+ hotelId));

        Room room=modelMapper.map(roomDto, Room.class);
        room.setHotel(hotel);
        hotel.getRooms().add(room);  // Keep both sides in sync
        roomRepository.save(room);
        return modelMapper.map(room, RoomDto.class);
        //TODO: create inventory as soon as room is created and hotel is active
    }

    @Override
    public List<RoomDto> getAllRoomsInHotel(Long hotelId) {
        log.info("Getting all rooms in hotel with hotel ID: {}", hotelId);
        Hotel hotel=hotelRepository
                .findById(hotelId)
                .orElseThrow(()->new ResourceNotFoundException("Hotel not found with ID"+hotelId));

        return hotel.getRooms()
                .stream().map((element) -> modelMapper.map(element, RoomDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public RoomDto getRoomById(Long roomId) {
        log.info("Getting the room by ID: {}", roomId);
        Room room=roomRepository.findById(roomId).orElseThrow(()-> new ResourceNotFoundException("Room not found with ID"+ roomId));

        return modelMapper.map(room, RoomDto.class);
    }



    @Override
    public void deleteRoomById(Long roomId) {
        log.info("Deleting the room by ID: {}", roomId);
        boolean existRoom=roomRepository.existsById(roomId);
        if(!existRoom){
            throw new ResourceNotFoundException("Room not found with ID"+ roomId);
        }

        roomRepository.deleteById(roomId);
        //TODO: delete all future inventories for this room
    }
}
