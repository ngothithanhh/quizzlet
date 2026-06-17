package com.example.quizzlet.controller;

import com.example.quizzlet.dto.auth.*;
import com.example.quizzlet.entity.User;
import com.example.quizzlet.service.AuthService;
import com.example.quizzlet.ultils.SecurityUtils;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request){
        authService.register(request.getUsername(), request.getEmail(), request.getPassword());

        return ResponseEntity.ok(Map.of("message","OTP đã gửi tới email: " + request.getEmail()));
    }

    @PostMapping("/register/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyOtpRequest request){
        authService.verifyOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.ok("Tạo tài khoản thành công!");
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request){
        return authService.login(request.getEmail(), request.getPassword());
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@RequestParam String token) {
        return authService.refresh(token);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestParam String token) {

        authService.logout(token);
        return ResponseEntity.ok("Đăng xuất thành công!");
    }


    @PostMapping("/forgot-password/otp")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestParam String email){
        authService.forgotPassword(email);
        return ResponseEntity.ok(Map.of("message","OTP đã gửi tới email: " + email));
    }

    @PostMapping("/forgot-password/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody ChangePasswordRequest request){
        String email = SecurityUtils.getCurrentUserEmail();
        authService.changePassword(email, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
    }




}
