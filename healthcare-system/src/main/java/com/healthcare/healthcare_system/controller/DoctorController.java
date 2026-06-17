package com.healthcare.healthcare_system.controller;

import com.healthcare.healthcare_system.dto.DoctorRegisterRequest;
import com.healthcare.healthcare_system.dto.DoctorUpdateRequest;
import com.healthcare.healthcare_system.entity.Doctor;
import com.healthcare.healthcare_system.service.DoctorService;
import com.healthcare.healthcare_system.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Doctors", description = "Doctor profiles, filtering, and admin approval/rejection")
@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AuthService authService;

    // Add doctor
    @PostMapping
    public Doctor addDoctor(@RequestBody Doctor doctor) {
        return doctorService.addDoctor(doctor);
    }

    // Get all doctors
    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    // Update doctor
    @PutMapping("/{id}")
    public Doctor update(@PathVariable Long id, @RequestBody DoctorUpdateRequest request) {
        Doctor doctorDetails = new Doctor();
        doctorDetails.setExperienceYears(request.getExperienceYears());
        doctorDetails.setDocumentUrl(request.getDocumentUrl());
        return doctorService.updateDoctor(id, doctorDetails, request.getName(), request.getSpecializationName(), request.getHospitalName(), request.getBiography());
    }

    // Get doctor by specialization
    @GetMapping("/specialization/{specializationId}")
    public List<Doctor> getDoctorsBySpecialization(@PathVariable Long specializationId) {
        return doctorService.getDoctorsBySpecialization(specializationId);
    }

    // Get doctor by hospital
    @GetMapping("/hospital/{hospitalId}")
    public List<Doctor> getDoctorsByHospital(@PathVariable Long hospitalId) {
        return doctorService.getDoctorsByHospital(hospitalId);
    }

    // Admin approve doctor
    @PutMapping("/{id}/approve")
    public Doctor approveDoctor(@PathVariable Long id) {
        return doctorService.approveDoctor(id);
    }

    // Admin reject doctor
    @PutMapping("/{id}/reject")
    public Doctor rejectDoctor(@PathVariable Long id) {
        return doctorService.rejectDoctor(id);
    }

    // Get doctor by ID
    @GetMapping("/{id}")
    public Doctor getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }

    // Get doctor by User ID
    @GetMapping("/user/{userId}")
    public Doctor getDoctorByUserId(@PathVariable Long userId) {
        return doctorService.getDoctorByUserId(userId);
    }
}