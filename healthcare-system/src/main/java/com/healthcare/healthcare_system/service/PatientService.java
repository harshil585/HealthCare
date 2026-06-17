package com.healthcare.healthcare_system.service;

import com.healthcare.healthcare_system.entity.Patient;
import com.healthcare.healthcare_system.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthcare.healthcare_system.exception.ResourceNotFoundException;

import com.healthcare.healthcare_system.entity.User;
import com.healthcare.healthcare_system.repository.UserRepository;

import java.util.List;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
    }

    public Patient getPatientByUserId(Long userId) {
        return patientRepository.findByUser_UserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found for ID: " + userId));
                    if ("PATIENT".equalsIgnoreCase(user.getRole())) {
                        System.out.println("SELF-HEALING: User ID " + userId + " is a PATIENT but had no Patient entity. Creating one now.");
                        Patient p = new Patient();
                        p.setUser(user);
                        p.setName(user.getName());
                        p.setPhone(user.getPhone());
                        p.setAge(30);
                        p.setGender(Patient.Gender.MALE);
                        return patientRepository.save(p);
                    } else {
                        throw new ResourceNotFoundException("User with ID " + userId + " is not a patient");
                    }
                });
    }

    public Patient updatePatient(Long id, Patient updated) {
        Patient existing = getPatientById(id);
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getPhone() != null) existing.setPhone(updated.getPhone());
        if (updated.getAge() != null) existing.setAge(updated.getAge());
        if (updated.getGender() != null) existing.setGender(updated.getGender());
        if (updated.getProfilePicture() != null) existing.setProfilePicture(updated.getProfilePicture());
        return patientRepository.save(existing);
    }
}
