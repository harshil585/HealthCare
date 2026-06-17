package com.healthcare.healthcare_system.controller;

import com.healthcare.healthcare_system.entity.Specialization;
import com.healthcare.healthcare_system.service.SpecializationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Specializations", description = "Manage medical specializations")
@RestController
@RequestMapping("/specialization")
public class SpecializationController {

    @Autowired
    private SpecializationService specializationService;

    @PostMapping
    public Specialization addSpecialization(@RequestBody Specialization specialization) {
        return specializationService.addSpecialization(specialization);
    }

    @GetMapping
    public List<Specialization> getAllSpecializations() {
        return specializationService.getAllSpecializations();
    }

    @GetMapping("/{id}")
    public Specialization getSpecializationById(@PathVariable Long id) {
        return specializationService.getSpecializationById(id);
    }

    @PutMapping("/{id}")
    public Specialization updateSpecialization(@PathVariable Long id, @RequestBody Specialization specialization) {
        return specializationService.updateSpecialization(id, specialization);
    }

    @DeleteMapping("/{id}")
    public void deleteSpecialization(@PathVariable Long id) {
        specializationService.deleteSpecialization(id);
    }
}
