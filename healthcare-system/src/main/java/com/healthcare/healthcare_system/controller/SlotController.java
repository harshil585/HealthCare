package com.healthcare.healthcare_system.controller;

import com.healthcare.healthcare_system.entity.Slot;
import com.healthcare.healthcare_system.entity.DoctorAvailability;
import com.healthcare.healthcare_system.service.SlotService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;
import org.springframework.format.annotation.DateTimeFormat;

@Tag(name = "Slots", description = "Create, update and query doctor appointment slots")
@RestController
@RequestMapping("/slot")
public class SlotController {

    @Autowired
    private SlotService slotService;

    // CREATE SLOT
    @PostMapping
    public Slot createSlot(@RequestParam Long doctorId, @RequestBody Slot slot) {
        return slotService.createSlot(doctorId, slot);
    }

    // GET ALL SLOTS
    @GetMapping("/doctor/{doctorId}")
    public List<Slot> getSlots(@PathVariable Long doctorId) {
        return slotService.getSlotsByDoctor(doctorId);
    }

    // GET AVAILABLE SLOTS
    @GetMapping("/available/{doctorId}")
    public List<Slot> getAvailableSlots(@PathVariable Long doctorId) {
        return slotService.getAvailableSlots(doctorId);
    }

    // GET AVAILABLE SLOTS BY DATE
    @GetMapping("/available/{doctorId}/date")
    public List<Slot> getAvailableSlotsByDate(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return slotService.getAvailableSlotsByDate(doctorId, date);
    }

    // CREATE BULK SLOTS
    @PostMapping("/batch")
    public List<Slot> createBulkSlots(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime shiftStart) {
        return slotService.createBulkSlots(doctorId, date, shiftStart);
    }

    // UPDATE SLOT
    @PutMapping("/{id}")
    public Slot updateSlot(@PathVariable Long id, @RequestBody Slot slot) {
        return slotService.updateSlot(id, slot);
    }

    // RESERVE SLOT (Lock for 3 mins)
    @PostMapping("/{id}/reserve")
    public Slot reserveSlot(@PathVariable Long id) {
        return slotService.reserveSlot(id);
    }

    // RELEASE SLOT
    @PostMapping("/{id}/release")
    public Slot releaseSlot(@PathVariable Long id) {
        return slotService.releaseSlot(id);
    }

    // DELETE SLOT
    @DeleteMapping("/{id}")
    public void deleteSlot(@PathVariable Long id) {
        slotService.deleteSlot(id);
    }

    // GET RECURRING AVAILABILITY TEMPLATES
    @GetMapping("/availability/doctor/{doctorId}")
    public List<DoctorAvailability> getAvailabilities(@PathVariable Long doctorId) {
        return slotService.getAvailabilities(doctorId);
    }

    // SAVE OR UPDATE RECURRING AVAILABILITY TEMPLATE
    @PostMapping("/availability/doctor/{doctorId}")
    public DoctorAvailability saveAvailability(@PathVariable Long doctorId, @RequestBody DoctorAvailability availability) {
        return slotService.saveAvailability(doctorId, availability);
    }

    // MANUALLY SEED SLOTS FOR THE NEXT N DAYS BASED ON ACTIVE TEMPLATES
    @PostMapping("/availability/doctor/{doctorId}/generate")
    public void seedSlots(@PathVariable Long doctorId, @RequestParam(defaultValue = "14") int daysLimit) {
        slotService.seedSlotsForNextDays(doctorId, daysLimit);
    }
}