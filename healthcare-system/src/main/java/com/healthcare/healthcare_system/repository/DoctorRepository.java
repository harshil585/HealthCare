package com.healthcare.healthcare_system.repository;

import com.healthcare.healthcare_system.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecialization_SpecializationId(Long specializationId);
    List<Doctor> findByHospital_HospitalId(Long hospitalId);
    Optional<Doctor> findByUser_UserId(Long userId);
}