package com.healthcare.healthcare_system.repository;

import com.healthcare.healthcare_system.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    List<Hospital> findByNameContainingIgnoreCaseOrCityContainingIgnoreCase(String name, String city);
    Optional<Hospital> findByName(String name);
}