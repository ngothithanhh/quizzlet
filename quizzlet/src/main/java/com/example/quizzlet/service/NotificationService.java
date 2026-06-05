package com.example.quizzlet.service;

import com.example.quizzlet.dto.notification.NotificationResponse;
import com.example.quizzlet.enums.NotificationType;

import java.util.List;

public interface NotificationService {
    void createNotification(Long userId, String title, String content, NotificationType type, Long referenceId, String referenceType);

    List<NotificationResponse> getMyNotifications();

    void markAsRead(Long notificationId);

    void markAllAsRead();

    long getUnreadCount();

}
