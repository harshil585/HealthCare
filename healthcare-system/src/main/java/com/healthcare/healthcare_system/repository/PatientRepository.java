package com.healthcare.healthcare_system.repository;

import com.healthcare.healthcare_system.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUser_UserId(Long userId);
}