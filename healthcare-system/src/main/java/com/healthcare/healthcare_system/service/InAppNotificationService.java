package com.healthcare.healthcare_system.service;

import com.healthcare.healthcare_system.entity.InAppNotification;
import com.healthcare.healthcare_system.entity.User;
import com.healthcare.healthcare_system.repository.InAppNotificationRepository;
import com.healthcare.healthcare_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InAppNotificationService {

    @Autowired
    private InAppNotificationRepository inAppNotificationRepository;

    @Autowired
    private UserRepository userRepository;

    public InAppNotification createNotification(Long userId, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        InAppNotification notification = new InAppNotification();
        notification.setUser(user);
        notification.setMessage(message);
        return inAppNotificationRepository.save(notification);
    }

    public List<InAppNotification> getUserNotifications(Long userId) {
        return inAppNotificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
    }

    public List<InAppNotification> getUnreadNotifications(Long userId) {
        return inAppNotificationRepository.findByUser_UserIdAndIsReadOrderByCreatedAtDesc(userId, false);
    }

    public InAppNotification markAsRead(Long notificationId) {
        InAppNotification notification = inAppNotificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        return inAppNotificationRepository.save(notification);
    }

    public void markAllAsRead(Long userId) {
        List<InAppNotification> unread = inAppNotificationRepository.findByUser_UserIdAndIsReadOrderByCreatedAtDesc(userId, false);
        for (InAppNotification notif : unread) {
            notif.setIsRead(true);
        }
        inAppNotificationRepository.saveAll(unread);
    }
}
