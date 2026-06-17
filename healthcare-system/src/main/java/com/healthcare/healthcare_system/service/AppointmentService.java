package com.healthcare.healthcare_system.service;

import com.healthcare.healthcare_system.entity.*;
import com.healthcare.healthcare_system.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDate;

@Service
public class AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentService.class);

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private InAppNotificationService inAppNotificationService;

    // 🔥 BOOK APPOINTMENT
    @Transactional
    public Appointment bookAppointment(Long patientId, Long doctorId, Long slotId, String symptoms, String medicalHistoryPdf) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (doctor.getStatus() != Doctor.Status.APPROVED) {
            throw new RuntimeException("Doctor is not approved to accept appointments");
        }

        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // check slot availability
        if (slot.getIsBooked()) {
            throw new RuntimeException("Slot already booked");
        }

        // create appointment
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setSlot(slot);
        appointment.setSymptoms(symptoms);
        appointment.setMedicalHistoryPdf(medicalHistoryPdf);

        // Auto-generate Jitsi consultation meeting URL
        String doctorCleanName = doctor.getUser().getName().replaceAll("[^a-zA-Z0-9]", "-").toLowerCase();
        String meetingUrl = "https://meet.jit.si/healthcareplus-" + doctorCleanName + "-" + slotId;
        appointment.setMeetingUrl(meetingUrl);

        // mark slot booked
        slot.setIsBooked(true);
        slotRepository.save(slot);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Dispatch notifications
        try {
            String patientMsg = "Dear " + patient.getName() + ",\n\n" +
                    "Your appointment with Dr. " + doctor.getUser().getName() + " has been booked successfully!\n\n" +
                    "📅 Date: " + slot.getSlotDate() + "\n" +
                    "⏰ Time: " + slot.getStartTime() + " - " + slot.getEndTime() + "\n" +
                    "💻 Jitsi Video Meeting Link: " + meetingUrl + "\n\n" +
                    "Thank you for choosing HealthCare+.";
            notificationService.dispatchNotifications(patient.getPhone(), patient.getUser().getEmail(), patientMsg);
            inAppNotificationService.createNotification(patient.getUser().getUserId(), "Your appointment with Dr. " + doctor.getUser().getName() + " has been booked successfully!");

            String doctorMsg = "Dr. " + doctor.getUser().getName() + ",\n\n" +
                    "A new appointment has been scheduled by " + patient.getName() + ".\n\n" +
                    "📅 Date: " + slot.getSlotDate() + "\n" +
                    "⏰ Time: " + slot.getStartTime() + " - " + slot.getEndTime() + "\n" +
                    "💻 Jitsi Video Meeting Link: " + meetingUrl;
            notificationService.dispatchNotifications(doctor.getUser().getPhone(), doctor.getUser().getEmail(), doctorMsg);
            inAppNotificationService.createNotification(doctor.getUser().getUserId(), "A new appointment has been scheduled by " + patient.getName() + " for " + slot.getSlotDate() + ".");
        } catch (Exception e) {
            logger.error("Could not dispatch booking notifications: {}", e.getMessage(), e);
        }

        return savedAppointment;
    }

    // 🔥 CANCEL APPOINTMENT
    public Appointment cancelAppointment(Long appointmentId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(Appointment.Status.CANCELLED);

        // free slot
        Slot slot = appointment.getSlot();
        slot.setIsBooked(false);
        slotRepository.save(slot);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Dispatch cancellation email
        try {
            String msg = "Appointment Cancellation Alert:\n\n" +
                    "The appointment scheduled for " + slot.getSlotDate() + " at " + slot.getStartTime() + " has been cancelled.";
            notificationService.dispatchNotifications(appointment.getPatient().getPhone(), appointment.getPatient().getUser().getEmail(), msg);
            notificationService.dispatchNotifications(appointment.getDoctor().getUser().getPhone(), appointment.getDoctor().getUser().getEmail(), msg);
            inAppNotificationService.createNotification(appointment.getPatient().getUser().getUserId(), 
                "Your appointment with Dr. " + appointment.getDoctor().getUser().getName() + " on " + slot.getSlotDate() + " has been cancelled.");
            inAppNotificationService.createNotification(appointment.getDoctor().getUser().getUserId(), 
                "The appointment scheduled by " + appointment.getPatient().getName() + " for " + slot.getSlotDate() + " has been cancelled.");
        } catch (Exception e) {
            logger.error("Could not dispatch cancellation notifications: {}", e.getMessage(), e);
        }

        return savedAppointment;
    }

    // 🔥 VIEW PATIENT APPOINTMENTS
    public List<Appointment> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatient_Id(patientId);
    }

    // 🔥 VIEW DOCTOR APPOINTMENTS
    public List<Appointment> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctor_DoctorId(doctorId);
    }

    // 🔥 COMPLETE APPOINTMENT
    public Appointment completeAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() == Appointment.Status.CANCELLED) {
            throw new RuntimeException("Cannot complete a cancelled appointment");
        }

        appointment.setStatus(Appointment.Status.COMPLETED);
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        try {
            // In-app notifications
            inAppNotificationService.createNotification(appointment.getPatient().getUser().getUserId(), 
                "Your appointment with Dr. " + appointment.getDoctor().getUser().getName() + " on " + appointment.getSlot().getSlotDate() + " is complete. Please submit a review!");
            inAppNotificationService.createNotification(appointment.getDoctor().getUser().getUserId(), 
                "Appointment with " + appointment.getPatient().getName() + " on " + appointment.getSlot().getSlotDate() + " has been completed.");

            // Email/SMS notifications (previously missing)
            String patientMsg = "Dear " + appointment.getPatient().getName() + ",\n\n" +
                    "Your appointment with Dr. " + appointment.getDoctor().getUser().getName() + 
                    " on " + appointment.getSlot().getSlotDate() + " has been completed.\n\n" +
                    "We hope your consultation was helpful! Please take a moment to leave a review.\n\n" +
                    "Thank you for choosing HealthCare+.";
            notificationService.dispatchNotifications(
                appointment.getPatient().getPhone(), 
                appointment.getPatient().getUser().getEmail(), 
                patientMsg);

            String doctorMsg = "Dr. " + appointment.getDoctor().getUser().getName() + ",\n\n" +
                    "Your appointment with " + appointment.getPatient().getName() + 
                    " on " + appointment.getSlot().getSlotDate() + " has been marked as completed.\n\n" +
                    "Thank you for your service!";
            notificationService.dispatchNotifications(
                appointment.getDoctor().getUser().getPhone(),
                appointment.getDoctor().getUser().getEmail(), 
                doctorMsg);
        } catch (Exception e) {
            logger.error("Could not dispatch completion notifications: {}", e.getMessage(), e);
        }
        return savedAppointment;
    }

    // 🔥 GET ALL APPOINTMENTS (Admin)
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // 🔥 GET UPCOMING APPOINTMENTS (Doctor)
    public List<Appointment> getUpcomingAppointments(Long doctorId) {
        return appointmentRepository.findByDoctor_DoctorIdAndStatusAndSlot_SlotDateGreaterThanEqual(
            doctorId, 
            Appointment.Status.BOOKED, 
            LocalDate.now()
        );
    }

    // 🔥 RESCHEDULE APPOINTMENT
    public Appointment rescheduleAppointment(Long appointmentId, Long newSlotId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() != Appointment.Status.BOOKED) {
            throw new RuntimeException("Only booked appointments can be rescheduled");
        }

        Slot newSlot = slotRepository.findById(newSlotId)
                .orElseThrow(() -> new RuntimeException("New slot not found"));

        if (newSlot.getIsBooked()) {
            throw new RuntimeException("New slot is already booked");
        }

        // Free old slot
        Slot oldSlot = appointment.getSlot();
        oldSlot.setIsBooked(false);
        slotRepository.save(oldSlot);

        // Book new slot
        newSlot.setIsBooked(true);
        slotRepository.save(newSlot);

        // Update appointment
        appointment.setSlot(newSlot);
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Dispatch reschedule notifications (previously missing)
        try {
            String patientMsg = "Dear " + appointment.getPatient().getName() + ",\n\n" +
                    "Your appointment with Dr. " + appointment.getDoctor().getUser().getName() + " has been rescheduled.\n\n" +
                    "📅 Previous: " + oldSlot.getSlotDate() + " at " + oldSlot.getStartTime() + "\n" +
                    "📅 New: " + newSlot.getSlotDate() + " at " + newSlot.getStartTime() + " - " + newSlot.getEndTime() + "\n\n" +
                    "Thank you for choosing HealthCare+.";
            notificationService.dispatchNotifications(
                appointment.getPatient().getPhone(),
                appointment.getPatient().getUser().getEmail(), 
                patientMsg);
            inAppNotificationService.createNotification(appointment.getPatient().getUser().getUserId(),
                "Your appointment with Dr. " + appointment.getDoctor().getUser().getName() + " has been rescheduled to " + newSlot.getSlotDate() + " at " + newSlot.getStartTime() + ".");

            String doctorMsg = "Dr. " + appointment.getDoctor().getUser().getName() + ",\n\n" +
                    "An appointment with " + appointment.getPatient().getName() + " has been rescheduled.\n\n" +
                    "📅 Previous: " + oldSlot.getSlotDate() + " at " + oldSlot.getStartTime() + "\n" +
                    "📅 New: " + newSlot.getSlotDate() + " at " + newSlot.getStartTime() + " - " + newSlot.getEndTime();
            notificationService.dispatchNotifications(
                appointment.getDoctor().getUser().getPhone(),
                appointment.getDoctor().getUser().getEmail(), 
                doctorMsg);
            inAppNotificationService.createNotification(appointment.getDoctor().getUser().getUserId(),
                "Appointment with " + appointment.getPatient().getName() + " has been rescheduled to " + newSlot.getSlotDate() + " at " + newSlot.getStartTime() + ".");
        } catch (Exception e) {
            logger.error("Could not dispatch reschedule notifications: {}", e.getMessage(), e);
        }

        return savedAppointment;
    }

    // 🔥 UPDATE MEETING URL (Video Consultation)
    public Appointment updateMeetingUrl(Long appointmentId, String meetingUrl) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setMeetingUrl(meetingUrl);
        return appointmentRepository.save(appointment);
    }

    // 🔥 UPDATE SUMMARY (AI Generated)
    public Appointment updateSummary(Long appointmentId, String summary) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setSummary(summary);
        return appointmentRepository.save(appointment);
    }
}