package com.akash.projects.airBnbApp.repository;

import com.akash.projects.airBnbApp.entity.Booking;
import com.akash.projects.airBnbApp.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
            select coalesce(sum(b.roomsCount), 0)
            from Booking b
            where b.room.id = :roomId
              and b.bookingStatus <> :cancelledStatus
              and b.checkInDate < :checkOutDate
              and b.checkOutDate > :checkInDate
            """)
    Long getBookedRoomsCount(
            @Param("roomId") Long roomId,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate,
            @Param("cancelledStatus") BookingStatus cancelledStatus);
}
