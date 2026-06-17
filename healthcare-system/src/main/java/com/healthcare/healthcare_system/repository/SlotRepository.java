package com.healthcare.healthcare_system.repository;

import com.healthcare.healthcare_system.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SlotRepository extends JpaRepository<Slot, Long> {

    List<Slot> findByDoctor_DoctorId(Long doctorId);

    List<Slot> findByDoctor_DoctorIdAndIsBookedFalse(Long doctorId);

    List<Slot> findByDoctor_DoctorIdAndSlotDate(Long doctorId, java.time.LocalDate slotDate);

    boolean existsByDoctor_DoctorIdAndSlotDate(Long doctorId, java.time.LocalDate slotDate);
}