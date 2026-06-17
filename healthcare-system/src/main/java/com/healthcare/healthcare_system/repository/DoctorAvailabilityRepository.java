package com.healthcare.healthcare_system.repository;

import com.healthcare.healthcare_system.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    List<DoctorAvailability> findByDoctor_DoctorId(Long doctorId);
    List<DoctorAvailability> findByDoctor_DoctorIdAndIsActiveTrue(Long doctorId);
    List<DoctorAvailability> findByIsActiveTrue();
    Optional<DoctorAvailability> findByDoctor_DoctorIdAndDayOfWeek(Long doctorId, String dayOfWeek);
}
