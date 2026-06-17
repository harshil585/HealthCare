package com.healthcare.healthcare_system.scheduler;

import com.healthcare.healthcare_system.entity.DoctorAvailability;
import com.healthcare.healthcare_system.repository.DoctorAvailabilityRepository;
import com.healthcare.healthcare_system.service.SlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
public class SlotGenerationScheduler {

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    @Autowired
    private SlotService slotService;

    // Runs every night at midnight (00:00) to populate slots for Day T + 14
    @Scheduled(cron = "0 0 0 * * ?")
    public void runDailySlotPopulator() {
        LocalDate targetDate = LocalDate.now().plusDays(14);
        String dayOfWeekStr = targetDate.getDayOfWeek().toString(); // e.g. "MONDAY"

        List<DoctorAvailability> activeAvailabilities = availabilityRepository.findByIsActiveTrue();
        for (DoctorAvailability avail : activeAvailabilities) {
            if (avail.getDayOfWeek().equalsIgnoreCase(dayOfWeekStr)) {
                slotService.generateSlotsForDate(avail.getDoctor(), targetDate, avail);
            }
        }
    }
}
