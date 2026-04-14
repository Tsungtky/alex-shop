package com.alexshop.backend.service;

import com.alexshop.backend.entity.Review;
import com.alexshop.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public List<Review> getReviewsByProductId(Integer productId){
        return  reviewRepository.findByProductId(productId);
    }

    public Review addReview(Review review){
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    public void removeReviewById(Integer reviewId){
        reviewRepository.deleteById(reviewId);
    }
}
