package com.akash.projects.airBnbApp.repository;

import com.akash.projects.airBnbApp.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByHotelId(Long hotelId);
    List<Review> findByUserId(Long userId);
    Review findByHotelIdAndUserId(Long hotelId, Long userId);
}
