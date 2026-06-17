package com.healthcare.healthcare_system.dto;

public class DoctorRegisterRequest {

    private String name;
    private String email;
    private String password;
    private String phone;

    private String specializationName;
    private String hospitalName;
    private Integer experienceYears;
    private String licenseNumber;

    // GETTERS & SETTERS

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getPhone() {
        return phone;
    }

    public String getSpecializationName() {
        return specializationName;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setSpecializationName(String specializationName) {
        this.specializationName = specializationName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }
}