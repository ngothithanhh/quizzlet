package com.example.quizzlet.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "is_revoked")
    private Boolean isRevoked = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
