package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.ReviewDto;
import com.akash.projects.airBnbApp.entity.Hotel;
import com.akash.projects.airBnbApp.entity.Review;
import com.akash.projects.airBnbApp.entity.User;
import com.akash.projects.airBnbApp.exception.ResourceNotFoundException;
import com.akash.projects.airBnbApp.repository.HotelRepository;
import com.akash.projects.airBnbApp.repository.ReviewRepository;
import com.akash.projects.airBnbApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public ReviewDto createReview(Long hotelId, ReviewDto reviewDto) {
        log.info("Creating review for hotelId: {}", hotelId);
        
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));
        
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if user already reviewed this hotel
        if (reviewRepository.findByHotelIdAndUserId(hotelId, user.getId()) != null) {
            throw new RuntimeException("You have already reviewed this hotel");
        }

        Review review = modelMapper.map(reviewDto, Review.class);
        review.setHotel(hotel);
        review.setUser(user);
        
        review = reviewRepository.save(review);
        log.info("Review created successfully with ID: {}", review.getId());
        
        ReviewDto response = modelMapper.map(review, ReviewDto.class);
        response.setUserName(user.getName());
        return response;
    }

    @Override
    public List<ReviewDto> getReviewsByHotel(Long hotelId) {
        log.info("Getting reviews for hotelId: {}", hotelId);
        return reviewRepository.findByHotelId(hotelId)
                .stream()
                .map(review -> {
                    ReviewDto dto = modelMapper.map(review, ReviewDto.class);
                    dto.setUserName(review.getUser().getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDto> getReviewsByUser() {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        log.info("Getting reviews for user: {}", email);
        return reviewRepository.findByUserId(user.getId())
                .stream()
                .map(review -> {
                    ReviewDto dto = modelMapper.map(review, ReviewDto.class);
                    dto.setUserName(review.getUser().getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ReviewDto updateReview(Long reviewId, ReviewDto reviewDto) {
        log.info("Updating review with ID: {}", reviewId);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));

        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        
        if (!review.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You can only update your own reviews");
        }

        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());
        
        review = reviewRepository.save(review);
        log.info("Review updated successfully");
        
        ReviewDto response = modelMapper.map(review, ReviewDto.class);
        response.setUserName(review.getUser().getName());
        return response;
    }

    @Override
    public void deleteReview(Long reviewId) {
        log.info("Deleting review with ID: {}", reviewId);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));

        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        
        if (!review.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You can only delete your own reviews");
        }

        reviewRepository.deleteById(reviewId);
        log.info("Review deleted successfully");
    }
}
