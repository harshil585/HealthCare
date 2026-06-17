package com.healthcare.healthcare_system.service;

import com.healthcare.healthcare_system.entity.Hospital;
import com.healthcare.healthcare_system.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    public Hospital addHospital(Hospital hospital) {
        return hospitalRepository.save(hospital);
    }

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    public Hospital getHospitalById(Long id) {
        return hospitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
    }

    public Hospital updateHospital(Long id, Hospital updated) {
        Hospital existing = getHospitalById(id);
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getAddress() != null) existing.setAddress(updated.getAddress());
        if (updated.getCity() != null) existing.setCity(updated.getCity());
        if (updated.getContactNumber() != null) existing.setContactNumber(updated.getContactNumber());
        return hospitalRepository.save(existing);
    }

    public void deleteHospital(Long id) {
        hospitalRepository.deleteById(id);
    }

    public List<Hospital> searchHospitals(String query) {
        return hospitalRepository.findByNameContainingIgnoreCaseOrCityContainingIgnoreCase(query, query);
    }
}
