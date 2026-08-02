package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.ReviewDto;

import java.util.List;

public interface ReviewService {
    ReviewDto createReview(Long hotelId, ReviewDto reviewDto);
    List<ReviewDto> getReviewsByHotel(Long hotelId);
    List<ReviewDto> getReviewsByUser();
    ReviewDto updateReview(Long reviewId, ReviewDto reviewDto);
    void deleteReview(Long reviewId);
}
