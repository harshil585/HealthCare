package com.healthcare.healthcare_system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    private Long doctorId;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "specialization_id")
    private Specialization specialization;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "document_url")
    private String documentUrl;

    @Column(name = "biography", length = 1000)
    private String biography;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status = Status.PENDING;

    @Column(name = "consultation_fee")
    private Integer consultationFee;

    @Column(name = "languages")
    private String languages;

    @Column(name = "qualification")
    private String qualification;

    @Column(name = "gender")
    private String gender;

    @Column(name = "profile_picture", columnDefinition = "TEXT")
    private String profilePicture;

    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    @Column(name = "review_count")
    private Integer reviewCount = 0;

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED
    }

    // ✅ GETTERS & SETTERS

    public Long getDoctorId() {
        return doctorId;
    }

    public User getUser() {
        return user;
    }

    public Specialization getSpecialization() {
        return specialization;
    }

    public Hospital getHospital() {
        return hospital;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public String getDocumentUrl() {
        return documentUrl;
    }

    public Status getStatus() {
        return status;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setSpecialization(Specialization specialization) {
        this.specialization = specialization;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    public Integer getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Integer consultationFee) {
        this.consultationFee = consultationFee;
    }

    public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }
}