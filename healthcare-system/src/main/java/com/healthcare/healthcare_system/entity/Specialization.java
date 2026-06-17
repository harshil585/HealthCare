package com.healthcare.healthcare_system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Specializations")
public class Specialization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "specialization_id")
    private Long specializationId;

    private String name;
    private String description;

    public Long getSpecializationId() {
        return specializationId;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public void setSpecializationId(Long specializationId) {
        this.specializationId = specializationId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}