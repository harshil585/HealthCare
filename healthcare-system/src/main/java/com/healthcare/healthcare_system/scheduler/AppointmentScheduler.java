package com.healthcare.healthcare_system.scheduler;

import com.healthcare.healthcare_system.entity.Appointment;
import com.healthcare.healthcare_system.entity.Slot;
import com.healthcare.healthcare_system.repository.AppointmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public class AppointmentScheduler {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentScheduler.class);

    @Autowired
    private AppointmentRepository appointmentRepository;

    // Run every 60 seconds (60000 ms)
    @Scheduled(fixedRate = 60000)
    public void autoExpireMissedAppointments() {
        List<Appointment> bookedAppointments = appointmentRepository.findByStatusAndSlot_SlotDateLessThanEqual(Appointment.Status.BOOKED, LocalDate.now());
        LocalDateTime now = LocalDateTime.now();

        for (Appointment appointment : bookedAppointments) {
            if (appointment.getStatus() == Appointment.Status.BOOKED) {
                Slot slot = appointment.getSlot();
                if (slot != null && slot.getSlotDate() != null && slot.getEndTime() != null) {
                    LocalDate date = slot.getSlotDate();
                    LocalTime endTime = slot.getEndTime();
                    LocalDateTime expirationTime = LocalDateTime.of(date, endTime).plusHours(2);

                    if (now.isAfter(expirationTime)) {
                        logger.info("SCHEDULER: Appointment ID {} has missed the slot time and buffer. Marking as NO_SHOW.", appointment.getAppointmentId());
                        appointment.setStatus(Appointment.Status.NO_SHOW);
                        appointmentRepository.save(appointment);
                    }
                }
            }
        }
    }
}
