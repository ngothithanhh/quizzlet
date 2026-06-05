package com.example.quizzlet.service.impl;

import com.example.quizzlet.dto.notification.NotificationResponse;
import com.example.quizzlet.entity.Notification;
import com.example.quizzlet.entity.User;
import com.example.quizzlet.enums.NotificationType;
import com.example.quizzlet.mapper.NotificationMapper;
import com.example.quizzlet.repository.NotificationRepository;
import com.example.quizzlet.repository.UserRepository;
import com.example.quizzlet.service.NotificationService;
import com.example.quizzlet.ultils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public void createNotification(Long userId, String title, String content, NotificationType type, Long referenceId, String referenceType){
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Không tìm thấy người dùng!"));

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .content(content)
                .type(type)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationResponse> getMyNotifications(){
        Long userId = SecurityUtils.getCurrentUserId();

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationMapper :: toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Long notificationId){
        Long userId = SecurityUtils.getCurrentUserId();
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(()->new RuntimeException("Không tìm thấy thông báo!"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(){
        Long userId = SecurityUtils.getCurrentUserId();
        notificationRepository.markAllAsReadByUserId(userId);
    }

    @Override
    public long getUnreadCount(){
        Long userId = SecurityUtils.getCurrentUserId();
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

}
