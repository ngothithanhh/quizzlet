package com.example.quizzlet.service.impl;

import com.example.quizzlet.config.PasswordConfig;
import com.example.quizzlet.dto.auth.AuthResponse;
import com.example.quizzlet.entity.RefreshToken;
import com.example.quizzlet.entity.User;
import com.example.quizzlet.enums.OtpType;
import com.example.quizzlet.repository.UserRepository;
import com.example.quizzlet.security.jwt.JwtUtil;
import com.example.quizzlet.service.AuthService;
import com.example.quizzlet.service.OtpService;
import com.example.quizzlet.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    @Override
    public void register(String username, String email, String password){
        if(userRepository.findByEmail(email).isPresent())
            throw new RuntimeException("Email đã tồn tại");

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .isVerified(false)
                .build();

        userRepository.save(user);

        otpService.generateOtp(email, OtpType.REGISTER);
    }

    @Override
    public void verifyOtp(String email, String otp){
        otpService.verifyOtp(email,otp);

        User user = userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User không tồn tại"));

        user.setIsVerified(true);
        userRepository.save(user);
    }

    @Override
    public AuthResponse login(String email, String password){
        User user = userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User không tồn tại"));

        if(!passwordEncoder.matches(password,user.getPassword()))
            throw new RuntimeException("Sai mật khẩu!");

        if(!user.getIsVerified())
            throw new RuntimeException("Tài khoản chưa được xác thực!");

        String accessToken = jwtUtil.generateToken(user.getEmail());
        RefreshToken refreshToken = refreshTokenService.createToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    @Override
    public AuthResponse refresh(String refreshToken){
        RefreshToken token = refreshTokenService.verify(refreshToken);

        String newAccessToken = jwtUtil.generateToken(token.getUser().getEmail());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public void logout(String refreshToken){
        refreshTokenService.revoke(refreshToken);
    }

    @Override
    public void forgotPassword(String email){
        otpService.generateOtp(email,OtpType.FORGOT_PASSWORD);
    }

    @Override
    public void resetPassword(String email, String otp, String newPass){
        otpService.verifyOtp(email, otp);
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setPassword(passwordEncoder.encode(newPass));
        userRepository.save(user);
    }

    @Override
    public void changePassword(String email,String oldPass, String newPass){
        User user = userRepository.findByEmail(email).orElseThrow();

        if(!passwordEncoder.matches(oldPass, user.getPassword())){
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }

        user.setPassword(passwordEncoder.encode(newPass));
        userRepository.save(user);
    }
}
