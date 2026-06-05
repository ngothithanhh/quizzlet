package com.example.quizzlet.mapper;

import com.example.quizzlet.dto.notification.NotificationResponse;
import com.example.quizzlet.entity.Notification;

import java.util.stream.Collectors;

public class NotificationMapper {
    public static NotificationResponse toResponse(Notification notification){
        return NotificationResponse.builder()
                        .id(notification.getId())
                        .title(notification.getTitle())
                        .content(notification.getContent())
                        .type(notification.getType())
                        .isRead(notification.getIsRead())
                        .referenceId(notification.getReferenceId())
                        .referenceType(notification.getReferenceType())
                        .createdAt(notification.getCreatedAt())
                        .build();
    }
}
