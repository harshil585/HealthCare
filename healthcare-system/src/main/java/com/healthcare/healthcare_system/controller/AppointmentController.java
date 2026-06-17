package com.healthcare.healthcare_system.controller;

import com.healthcare.healthcare_system.entity.Appointment;
import com.healthcare.healthcare_system.service.AppointmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Appointments", description = "Book, cancel, complete, and reschedule appointments")
@RestController
@RequestMapping("/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // 🔥 BOOK
    @PostMapping("/book")
    public Appointment book(@RequestParam Long patientId,
                            @RequestParam Long doctorId,
                            @RequestParam Long slotId,
                            @RequestParam(required = false) String symptoms,
                            @RequestParam(required = false) String medicalHistoryPdf) {

        return appointmentService.bookAppointment(patientId, doctorId, slotId, symptoms, medicalHistoryPdf);
    }

    // 🔥 CANCEL
    @DeleteMapping("/{id}")
    public Appointment cancel(@PathVariable Long id) {
        return appointmentService.cancelAppointment(id);
    }

    // 🔥 VIEW PATIENT
    @GetMapping("/patient/{patientId}")
    public List<Appointment> getPatient(@PathVariable Long patientId) {
        return appointmentService.getPatientAppointments(patientId);
    }

    // 🔥 VIEW DOCTOR
    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getDoctor(@PathVariable Long doctorId) {
        return appointmentService.getDoctorAppointments(doctorId);
    }

    // 🔥 COMPLETE
    @PutMapping("/{id}/complete")
    public Appointment complete(@PathVariable Long id) {
        return appointmentService.completeAppointment(id);
    }

    // 🔥 VIEW ALL (ADMIN)
    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    // 🔥 VIEW UPCOMING (DOCTOR)
    @GetMapping("/doctor/{doctorId}/upcoming")
    public List<Appointment> getUpcomingAppointments(@PathVariable Long doctorId) {
        return appointmentService.getUpcomingAppointments(doctorId);
    }

    // 🔥 RESCHEDULE
    @PutMapping("/{id}/reschedule")
    public Appointment reschedule(
            @PathVariable Long id, 
            @RequestParam Long newSlotId) {
        return appointmentService.rescheduleAppointment(id, newSlotId);
    }

    // 🔥 UPDATE MEETING URL
    @PutMapping("/{id}/meeting")
    public Appointment updateMeetingUrl(@PathVariable Long id, @RequestParam String meetingUrl) {
        return appointmentService.updateMeetingUrl(id, meetingUrl);
    }

    // 🔥 UPDATE SUMMARY
    @PutMapping("/{id}/summary")
    public Appointment updateSummary(@PathVariable Long id, @RequestBody String summary) {
        return appointmentService.updateSummary(id, summary);
    }
}