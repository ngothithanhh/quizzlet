package com.example.quizzlet.service.impl;

import com.example.quizzlet.entity.RefreshToken;
import com.example.quizzlet.entity.User;
import com.example.quizzlet.repository.RefreshTokenRepository;
import com.example.quizzlet.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    @Override
    public RefreshToken createToken(User user){
        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusDays(7))
                .isRevoked(false)
                .build();

        return refreshTokenRepository.save(token);
    }

    @Override
    public RefreshToken verify(String token){
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token).orElseThrow(()-> new RuntimeException("Refresh token không tìm thấy"));
        if(refreshToken.getIsRevoked())
            throw new RuntimeException("Refresh token đã bị thu hồi");

        if(refreshToken.getExpiryDate().isBefore(LocalDateTime.now()))
            throw new RuntimeException("Refresh token đã hết hạn");

        return refreshToken;
    }
    @Override
    public void revoke(String token){
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token).orElseThrow(()-> new RuntimeException("Refresh token không tìm thấy"));

        refreshToken.setIsRevoked(true);
        refreshTokenRepository.save(refreshToken);
    }
}
