package com.healthcare.healthcare_system.controller;

import com.healthcare.healthcare_system.entity.InAppNotification;
import com.healthcare.healthcare_system.service.InAppNotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Notifications", description = "View and manage in-app user notifications")
@RestController
@RequestMapping("/notification")
public class InAppNotificationController {

    @Autowired
    private InAppNotificationService notificationService;

    @GetMapping("/user/{userId}")
    public List<InAppNotification> getNotifications(@PathVariable Long userId) {
        return notificationService.getUserNotifications(userId);
    }

    @GetMapping("/user/{userId}/unread")
    public List<InAppNotification> getUnreadNotifications(@PathVariable Long userId) {
        return notificationService.getUnreadNotifications(userId);
    }

    @PutMapping("/{id}/read")
    public InAppNotification markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    @PutMapping("/user/{userId}/read-all")
    public void markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
    }
}
