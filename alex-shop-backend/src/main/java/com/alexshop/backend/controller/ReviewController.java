package com.alexshop.backend.controller;

import com.alexshop.backend.entity.Review;
import com.alexshop.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public List<Review> getReviewsByProductId(@PathVariable Integer productId){
        return reviewService.getReviewsByProductId(productId);
    }

    @PostMapping
    public Review addReview(@RequestBody Review review){
        return reviewService.addReview(review);
    }

    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Integer id){
        reviewService.removeReviewById(id);
    }
}
