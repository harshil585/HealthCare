package com.healthcare.healthcare_system.service;

import com.healthcare.healthcare_system.entity.Specialization;
import com.healthcare.healthcare_system.repository.SpecializationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpecializationService {

    @Autowired
    private SpecializationRepository specializationRepository;

    public Specialization addSpecialization(Specialization specialization) {
        return specializationRepository.save(specialization);
    }

    public List<Specialization> getAllSpecializations() {
        return specializationRepository.findAll();
    }

    public Specialization getSpecializationById(Long id) {
        return specializationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Specialization not found"));
    }

    public Specialization updateSpecialization(Long id, Specialization updated) {
        Specialization existing = getSpecializationById(id);
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        return specializationRepository.save(existing);
    }

    public void deleteSpecialization(Long id) {
        specializationRepository.deleteById(id);
    }
}
