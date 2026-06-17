package com.healthcare.healthcare_system.repository;

import com.healthcare.healthcare_system.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import java.time.LocalDate;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDoctor_DoctorId(Long doctorId);
    
    List<Appointment> findByPatient_Id(Long patientId);
    
    List<Appointment> findByDoctor_DoctorIdAndStatusAndSlot_SlotDateGreaterThanEqual(Long doctorId, Appointment.Status status, LocalDate date);

    List<Appointment> findByStatusAndSlot_SlotDateLessThanEqual(Appointment.Status status, LocalDate date);
}