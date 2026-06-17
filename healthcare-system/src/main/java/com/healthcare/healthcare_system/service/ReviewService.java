package com.healthcare.healthcare_system.service;

import com.healthcare.healthcare_system.entity.Doctor;
import com.healthcare.healthcare_system.entity.Patient;
import com.healthcare.healthcare_system.entity.Review;
import com.healthcare.healthcare_system.repository.DoctorRepository;
import com.healthcare.healthcare_system.repository.PatientRepository;
import com.healthcare.healthcare_system.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public Review addReview(Long patientId, Long doctorId, Integer rating, String reviewText) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Review review = new Review();
        review.setPatient(patient);
        review.setDoctor(doctor);
        review.setRating(rating);
        review.setReviewText(reviewText);

        return reviewRepository.save(review);
    }

    public List<Review> getReviewsForDoctor(Long doctorId) {
        return reviewRepository.findByDoctor_DoctorIdOrderByCreatedAtDesc(doctorId);
    }

    public List<Review> getReviewsByPatient(Long patientId) {
        return reviewRepository.findByPatient_IdOrderByCreatedAtDesc(patientId);
    }
}
