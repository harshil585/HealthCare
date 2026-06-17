package com.healthcare.healthcare_system.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "Slots")
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slot_id")
    private Long slotId;

    @Column(name = "slot_date")
    private LocalDate slotDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "is_booked")
    private Boolean isBooked;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "reserved_until")
    private LocalDateTime reservedUntil;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    // AUTO SET VALUES
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.isBooked == null) {
            this.isBooked = false;
        }
    }

    // ✅ GETTERS & SETTERS

    public Long getSlotId() {
        return slotId;
    }

    public LocalDate getSlotDate() {
        return slotDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public Boolean getIsBooked() {
        return isBooked;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setSlotId(Long slotId) {
        this.slotId = slotId;
    }

    public void setSlotDate(LocalDate slotDate) {
        this.slotDate = slotDate;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public void setIsBooked(Boolean isBooked) {
        this.isBooked = isBooked;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public LocalDateTime getReservedUntil() {
        return reservedUntil;
    }

    public void setReservedUntil(LocalDateTime reservedUntil) {
        this.reservedUntil = reservedUntil;
    }
}