package com.example.quizzlet.service.impl;

import com.example.quizzlet.entity.EmailOtp;
import com.example.quizzlet.enums.OtpStatus;
import com.example.quizzlet.enums.OtpType;
import com.example.quizzlet.repository.OtpRepository;
import com.example.quizzlet.service.EmailService;
import com.example.quizzlet.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;

    @Override
    public String generateOtp(String email, OtpType type){

        otpRepository.invalidateOldOtp(email, type);

        String otp = String.valueOf(new Random().nextInt(900000)+100000);

        EmailOtp emailOtp = new EmailOtp();
        emailOtp.setEmail(email);
        emailOtp.setOtpCode(otp);
        emailOtp.setType(type);
        emailOtp.setStatus(OtpStatus.PENDING);
        emailOtp.setExpiresAt(LocalDateTime.now().plusMinutes(2));

        otpRepository.save(emailOtp);

        //gui email
        if (type == OtpType.FORGOT_PASSWORD) {
            emailService.sendResetPassword(email, otp);
        } else {
            emailService.sendOtp(email, otp);
        }
        return otp;
    }
    @Override
    public void verifyOtp(String email, String otp){
        EmailOtp otpCurrent = otpRepository.findTopByEmailAndStatusOrderByCreatedAtDesc(email,OtpStatus.PENDING).orElseThrow(()->new RuntimeException("OTP không tồn tại"));

        if(!otpCurrent.getOtpCode().equals(otp)){
            throw new RuntimeException("OTP sai!");
        }

        if(otpCurrent.getExpiresAt().isBefore(LocalDateTime.now())){
            otpCurrent.setStatus(OtpStatus.EXPIRED);
            otpRepository.save(otpCurrent);
            throw new RuntimeException("OTP hết hạn!");
        }

        otpCurrent.setStatus(OtpStatus.USED);
        otpRepository.save(otpCurrent);
    }
}
