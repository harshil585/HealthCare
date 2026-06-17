package com.healthcare.healthcare_system.service;

import com.healthcare.healthcare_system.entity.Doctor;
import com.healthcare.healthcare_system.entity.Slot;
import com.healthcare.healthcare_system.repository.DoctorRepository;
import com.healthcare.healthcare_system.repository.SlotRepository;

import com.healthcare.healthcare_system.entity.DoctorAvailability;
import com.healthcare.healthcare_system.repository.DoctorAvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.ArrayList;
@Service
public class SlotService {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    private void validateDoctorApproved(Doctor doctor) {
        if (doctor.getStatus() != Doctor.Status.APPROVED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Doctor is not approved by administrator");
        }
    }

    // CREATE SLOT
    public Slot createSlot(Long doctorId, Slot slot) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        validateDoctorApproved(doctor);

        slot.setDoctor(doctor);

        return slotRepository.save(slot);
    }

    // GET ALL SLOTS
    public List<Slot> getSlotsByDoctor(Long doctorId) {
        return slotRepository.findByDoctor_DoctorId(doctorId);
    }

    // GET AVAILABLE SLOTS
    public List<Slot> getAvailableSlots(Long doctorId) {
        List<Slot> slots = slotRepository.findByDoctor_DoctorIdAndIsBookedFalse(doctorId);
        LocalDateTime now = LocalDateTime.now();
        return slots.stream()
                .filter(slot -> slot.getReservedUntil() == null || slot.getReservedUntil().isBefore(now))
                .toList();
    }

    public List<Slot> getAvailableSlotsByDate(Long doctorId, LocalDate date) {
        LocalDateTime now = LocalDateTime.now();
        return slotRepository.findByDoctor_DoctorIdAndSlotDate(doctorId, date).stream()
                .filter(slot -> !slot.getIsBooked() && (slot.getReservedUntil() == null || slot.getReservedUntil().isBefore(now)))
                .toList();
    }

    public Slot reserveSlot(Long slotId) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (slot.getIsBooked()) {
            throw new RuntimeException("Slot is already booked");
        }

        LocalDateTime now = LocalDateTime.now();
        if (slot.getReservedUntil() != null && slot.getReservedUntil().isAfter(now)) {
            throw new RuntimeException("Slot is currently reserved by another patient");
        }

        slot.setReservedUntil(now.plusMinutes(3)); // 3 minutes lock
        return slotRepository.save(slot);
    }

    public Slot releaseSlot(Long slotId) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        slot.setReservedUntil(null);
        return slotRepository.save(slot);
    }

    public void deleteSlot(Long slotId) {
        slotRepository.deleteById(slotId);
    }

    public List<Slot> createBulkSlots(Long doctorId, LocalDate date, LocalTime shiftStart) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        validateDoctorApproved(doctor);

        List<Slot> createdSlots = new ArrayList<>();
        LocalTime currentStart = shiftStart;
        
        // Generate 16 slots of 30 mins each (8 hours total)
        for (int i = 0; i < 16; i++) {
            Slot slot = new Slot();
            slot.setDoctor(doctor);
            slot.setSlotDate(date);
            slot.setStartTime(currentStart);
            slot.setEndTime(currentStart.plusMinutes(30));
            // isBooked and createdAt are handled by @PrePersist
            
            createdSlots.add(slotRepository.save(slot));
            currentStart = currentStart.plusMinutes(30);
        }
        
        return createdSlots;
    }

    public Slot updateSlot(Long slotId, Slot updatedSlot) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (slot.getIsBooked()) {
            throw new RuntimeException("Cannot update an already booked slot");
        }

        if (slot.getDoctor() != null) {
            validateDoctorApproved(slot.getDoctor());
        }

        if (updatedSlot.getSlotDate() != null) slot.setSlotDate(updatedSlot.getSlotDate());
        if (updatedSlot.getStartTime() != null) slot.setStartTime(updatedSlot.getStartTime());
        if (updatedSlot.getEndTime() != null) slot.setEndTime(updatedSlot.getEndTime());

        return slotRepository.save(slot);
    }

    // GET RECURRING AVAILABILITY TEMPLATES
    public List<DoctorAvailability> getAvailabilities(Long doctorId) {
        return availabilityRepository.findByDoctor_DoctorId(doctorId);
    }

    // SAVE OR UPDATE RECURRING AVAILABILITY TEMPLATE
    public DoctorAvailability saveAvailability(Long doctorId, DoctorAvailability availability) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        validateDoctorApproved(doctor);

        availability.setDoctor(doctor);
        availability.setDayOfWeek(availability.getDayOfWeek().toUpperCase());

        // Check if there is an existing template for this doctor and day of week
        java.util.Optional<DoctorAvailability> existing = 
                availabilityRepository.findByDoctor_DoctorIdAndDayOfWeek(doctorId, availability.getDayOfWeek());

        if (existing.isPresent()) {
            DoctorAvailability current = existing.get();
            current.setStartTime(availability.getStartTime());
            current.setEndTime(availability.getEndTime());
            current.setSlotDurationMinutes(availability.getSlotDurationMinutes());
            current.setIsActive(availability.getIsActive());
            return availabilityRepository.save(current);
        }

        return availabilityRepository.save(availability);
    }

    // GENERATE SLOTS FOR DATE RANGE ON-DEMAND
    public void generateSlotsForDateRange(Long doctorId, LocalDate startDate, LocalDate endDate) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        validateDoctorApproved(doctor);

        List<DoctorAvailability> templates = availabilityRepository.findByDoctor_DoctorIdAndIsActiveTrue(doctorId);
        if (templates.isEmpty()) return;

        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            String dayOfWeekStr = currentDate.getDayOfWeek().toString();
            for (DoctorAvailability temp : templates) {
                if (temp.getDayOfWeek().equalsIgnoreCase(dayOfWeekStr)) {
                    generateSlotsForDate(doctor, currentDate, temp);
                }
            }
            currentDate = currentDate.plusDays(1);
        }
    }

    // HELPER: GENERATE SLOTS FOR A SPECIFIC DATE
    public void generateSlotsForDate(Doctor doctor, LocalDate date, DoctorAvailability template) {
        // Prevent duplicate generation for same date
        boolean exists = slotRepository.existsByDoctor_DoctorIdAndSlotDate(doctor.getDoctorId(), date);
        if (exists) return;

        LocalTime currentStart = template.getStartTime();
        LocalTime endLimit = template.getEndTime();
        int step = template.getSlotDurationMinutes();

        while (currentStart.plusMinutes(step).isBefore(endLimit) || currentStart.plusMinutes(step).equals(endLimit)) {
            Slot slot = new Slot();
            slot.setDoctor(doctor);
            slot.setSlotDate(date);
            slot.setStartTime(currentStart);
            slot.setEndTime(currentStart.plusMinutes(step));
            slot.setIsBooked(false);
            slotRepository.save(slot);
            currentStart = currentStart.plusMinutes(step);
        }
    }

    // SEED SLOTS FOR THE NEXT N DAYS IMMEDIATELY
    public void seedSlotsForNextDays(Long doctorId, int daysLimit) {
        LocalDate start = LocalDate.now();
        LocalDate end = LocalDate.now().plusDays(daysLimit);
        generateSlotsForDateRange(doctorId, start, end);
    }
}