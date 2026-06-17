package com.healthcare.healthcare_system.controller;

import com.healthcare.healthcare_system.entity.Review;
import com.healthcare.healthcare_system.service.ReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Reviews", description = "Submit and view feedback for doctors")
@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/add")
    public Review addReview(@RequestParam Long patientId,
                            @RequestParam Long doctorId,
                            @RequestParam Integer rating,
                            @RequestParam(required = false) String reviewText) {
        return reviewService.addReview(patientId, doctorId, rating, reviewText);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Review> getDoctorReviews(@PathVariable Long doctorId) {
        return reviewService.getReviewsForDoctor(doctorId);
    }

    @GetMapping("/patient/{patientId}")
    public List<Review> getPatientReviews(@PathVariable Long patientId) {
        return reviewService.getReviewsByPatient(patientId);
    }
}
