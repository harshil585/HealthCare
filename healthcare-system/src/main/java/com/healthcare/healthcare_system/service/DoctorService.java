package com.healthcare.healthcare_system.service;

import com.healthcare.healthcare_system.entity.Doctor;
import com.healthcare.healthcare_system.entity.Specialization;
import com.healthcare.healthcare_system.entity.Hospital;
import com.healthcare.healthcare_system.repository.DoctorRepository;
import com.healthcare.healthcare_system.repository.SpecializationRepository;
import com.healthcare.healthcare_system.repository.HospitalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DoctorService {

    private static final Logger logger = LoggerFactory.getLogger(DoctorService.class);

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private InAppNotificationService inAppNotificationService;

    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Transactional
    public Doctor updateDoctor(Long id, Doctor updatedDoctor, String name, String specializationName, String hospitalName, String biography) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (name != null && doctor.getUser() != null) {
            doctor.getUser().setName(name);
        }

        if (specializationName != null && !specializationName.trim().isEmpty()) {
            Specialization spec = specializationRepository.findByName(specializationName)
                .orElseGet(() -> {
                    Specialization newSpec = new Specialization();
                    newSpec.setName(specializationName);
                    newSpec.setDescription("Automatically created specialization");
                    return specializationRepository.save(newSpec);
                });
            doctor.setSpecialization(spec);
        }

        if (hospitalName != null && !hospitalName.trim().isEmpty()) {
            Hospital hosp = hospitalRepository.findByName(hospitalName)
                .orElseGet(() -> {
                    Hospital newHosp = new Hospital();
                    newHosp.setName(hospitalName);
                    newHosp.setCity("Unknown");
                    return hospitalRepository.save(newHosp);
                });
            doctor.setHospital(hosp);
        }

        if (updatedDoctor.getExperienceYears() != null) {
            doctor.setExperienceYears(updatedDoctor.getExperienceYears());
        }
        if (updatedDoctor.getDocumentUrl() != null) {
            doctor.setDocumentUrl(updatedDoctor.getDocumentUrl());
        }
        if (biography != null) {
            doctor.setBiography(biography);
        }

        return doctorRepository.save(doctor);
    }

    public List<Doctor> getDoctorsBySpecialization(Long specializationId) {
        return doctorRepository.findBySpecialization_SpecializationId(specializationId);
    }

    public List<Doctor> getDoctorsByHospital(Long hospitalId) {
        return doctorRepository.findByHospital_HospitalId(hospitalId);
    }

    public Doctor approveDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        if (doctor.getDocumentUrl() == null || doctor.getDocumentUrl().isEmpty()) {
            doctor.setDocumentUrl("https://healthcareplus.s3.amazonaws.com/documents/default_credential.pdf");
        }
        
        doctor.setStatus(Doctor.Status.APPROVED);
        Doctor savedDoctor = doctorRepository.save(doctor);

        // Send approval notification (previously missing)
        try {
            String msg = "Dear Dr. " + doctor.getUser().getName() + ",\n\n" +
                    "Congratulations! Your HealthCare+ account has been approved! 🎉\n\n" +
                    "You can now:\n" +
                    "✅ Set up your availability schedule\n" +
                    "✅ Accept patient appointments\n" +
                    "✅ Conduct video consultations via Jitsi\n\n" +
                    "Please log in and complete your profile setup.\n\n" +
                    "Welcome to the HealthCare+ family!";
            notificationService.sendEmailNotification(doctor.getUser().getEmail(), "HealthCare+ — Your Account is Approved! 🎉", msg);
            inAppNotificationService.createNotification(doctor.getUser().getUserId(), 
                "Your doctor account has been approved! You can now set up your schedule and accept appointments.");
            logger.info("Doctor approval notification sent to {}", doctor.getUser().getEmail());
        } catch (Exception e) {
            logger.error("Failed to send doctor approval notification: {}", e.getMessage(), e);
        }

        return savedDoctor;
    }

    public Doctor rejectDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        doctor.setStatus(Doctor.Status.REJECTED);
        Doctor savedDoctor = doctorRepository.save(doctor);

        // Send rejection notification (previously missing)
        try {
            String msg = "Dear Dr. " + doctor.getUser().getName() + ",\n\n" +
                    "We regret to inform you that your HealthCare+ doctor account application has not been approved at this time.\n\n" +
                    "This may be due to:\n" +
                    "• Incomplete documentation\n" +
                    "• Unverifiable credentials\n" +
                    "• Missing license information\n\n" +
                    "Please contact our support team at support@healthcareplus.com for further details or to resubmit your application.\n\n" +
                    "Thank you for your interest in HealthCare+.";
            notificationService.sendEmailNotification(doctor.getUser().getEmail(), "HealthCare+ — Account Application Update", msg);
            inAppNotificationService.createNotification(doctor.getUser().getUserId(), 
                "Your doctor account application has not been approved. Please contact support for details.");
            logger.info("Doctor rejection notification sent to {}", doctor.getUser().getEmail());
        } catch (Exception e) {
            logger.error("Failed to send doctor rejection notification: {}", e.getMessage(), e);
        }

        return savedDoctor;
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    public Doctor getDoctorByUserId(Long userId) {
        return doctorRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found for user ID: " + userId));
    }
}