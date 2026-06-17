package com.healthcare.healthcare_system.controller;

import com.healthcare.healthcare_system.entity.User;
import com.healthcare.healthcare_system.entity.Patient;
import com.healthcare.healthcare_system.entity.Doctor;
import com.healthcare.healthcare_system.repository.UserRepository;
import com.healthcare.healthcare_system.repository.PatientRepository;
import com.healthcare.healthcare_system.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping("/test")
    public Map<String, Object> testApi() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        return response;
    }
    
    @GetMapping("/debug/db")
    public Map<String, Object> debugDb() {
        Map<String, Object> response = new HashMap<>();
        response.put("usersCount", userRepository.count());
        response.put("patientsCount", patientRepository.count());
        response.put("doctorsCount", doctorRepository.count());
        
        response.put("users", userRepository.findAll().stream().map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("userId", u.getUserId());
            m.put("email", u.getEmail());
            m.put("role", u.getRole());
            return m;
        }).collect(Collectors.toList()));
        
        response.put("patients", patientRepository.findAll().stream().map(p -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", p.getId());
            m.put("name", p.getName());
            m.put("userId", p.getUser() != null ? p.getUser().getUserId() : null);
            return m;
        }).collect(Collectors.toList()));
        
        return response;
    }
}