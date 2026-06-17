package com.healthcare.healthcare_system.repository;

import com.healthcare.healthcare_system.entity.InAppNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InAppNotificationRepository extends JpaRepository<InAppNotification, Long> {
    List<InAppNotification> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
    List<InAppNotification> findByUser_UserIdAndIsReadOrderByCreatedAtDesc(Long userId, Boolean isRead);
}
