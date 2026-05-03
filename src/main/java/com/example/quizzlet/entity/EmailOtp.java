package com.example.quizzlet.entity;

import com.example.quizzlet.enums.OtpStatus;
import com.example.quizzlet.enums.OtpType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_otps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailOtp extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    @Column(name = "otp_code")
    private String otpCode;

    @Enumerated(EnumType.STRING)
    private OtpType type;

    @Enumerated(EnumType.STRING)
    private OtpStatus status = OtpStatus.PENDING;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
}
