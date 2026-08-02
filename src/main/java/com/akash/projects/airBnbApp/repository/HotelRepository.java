package com.akash.projects.airBnbApp.repository;

import com.akash.projects.airBnbApp.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    List<Hotel> findByCityContainingIgnoreCase(String city);
    
    List<Hotel> findByCityContainingIgnoreCaseAndIsActiveTrue(String city);

    List<Hotel> findByIsActiveTrue();

    @Query("SELECT h FROM Hotel h WHERE h.city LIKE %:city% AND h.isActive = true")
    List<Hotel> searchHotels(@Param("city") String city);

    @Query("SELECT h FROM Hotel h WHERE h.name LIKE %:name% AND h.isActive = true")
    List<Hotel> searchByName(@Param("name") String name);
}
