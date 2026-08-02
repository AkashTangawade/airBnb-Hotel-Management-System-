package com.akash.projects.airBnbApp.controller;

import com.akash.projects.airBnbApp.advice.ApiResponse;
import com.akash.projects.airBnbApp.dto.ReviewDto;
import com.akash.projects.airBnbApp.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/hotels/{hotelId}")
    public ResponseEntity<ApiResponse<ReviewDto>> createReview(
            @PathVariable Long hotelId,
            @Valid @RequestBody ReviewDto reviewDto) {
        ReviewDto review = reviewService.createReview(hotelId, reviewDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(review, "Review created successfully"));
    }

    @GetMapping("/hotels/{hotelId}")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getHotelReviews(@PathVariable Long hotelId) {
        List<ReviewDto> reviews = reviewService.getReviewsByHotel(hotelId);
        return ResponseEntity.ok(new ApiResponse<>(reviews, "Reviews fetched successfully"));
    }

    @GetMapping("/my-reviews")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getMyReviews() {
        List<ReviewDto> reviews = reviewService.getReviewsByUser();
        return ResponseEntity.ok(new ApiResponse<>(reviews, "Reviews fetched successfully"));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<ReviewDto>> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewDto reviewDto) {
        ReviewDto review = reviewService.updateReview(reviewId, reviewDto);
        return ResponseEntity.ok(new ApiResponse<>(review, "Review updated successfully"));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(new ApiResponse<>(null, "Review deleted successfully"));
    }
}
