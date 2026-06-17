package com.healthcare.healthcare_system.repository;

import com.healthcare.healthcare_system.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByDoctor_DoctorId(Long doctorId);
    List<Review> findByDoctor_DoctorIdOrderByCreatedAtDesc(Long doctorId);
    List<Review> findByPatient_IdOrderByCreatedAtDesc(Long patientId);
}
