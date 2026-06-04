package com.example.quizzlet.repository;

import com.example.quizzlet.entity.EmailOtp;
import com.example.quizzlet.enums.OtpStatus;
import com.example.quizzlet.enums.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<EmailOtp, Long> {
    Optional<EmailOtp> findTopByEmailAndStatusOrderByCreatedAtDesc(String email, OtpStatus status);
    @Modifying
    @Transactional
    @Query("""
        UPDATE EmailOtp e
        SET e.status = 'EXPIRED'
        WHERE e.email = :email
        AND e.type = :type
        AND e.status = 'PENDING'
    """)
    void invalidateOldOtp(@Param("email") String email,
                          @Param("type") OtpType type);
}
