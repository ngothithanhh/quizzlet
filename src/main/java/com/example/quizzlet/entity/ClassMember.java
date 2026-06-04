package com.example.quizzlet.entity;

import com.example.quizzlet.enums.ClassRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "class_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ClassMember {

   @EmbeddedId
   private ClassMemberId id;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private ClassRole role = ClassRole.STUDENT;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    @ManyToOne
    @MapsId("classId")
    @JoinColumn(name = "class_id")
    private Classroom classroom;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;
}
