package com.akash.projects.airBnbApp.repository;

import com.akash.projects.airBnbApp.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    List<Inventory> findByRoomIdAndDateBetween(Long roomId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT i FROM Inventory i WHERE i.city = :city AND i.date BETWEEN :checkIn AND :checkOut AND i.closed = false AND i.bookedCount < i.totalCount")
    List<Inventory> findByCityAndDateBetweenAndClosedFalseAndBookedCountLessThanTotalCount(
            @Param("city") String city,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut);

    List<Inventory> findByHotelId(Long hotelId);

    void deleteByHotelId(Long hotelId);
}
