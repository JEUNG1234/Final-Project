package com.kh.sowm.controller;

import com.kh.sowm.dto.PasswordResetDto;
import com.kh.sowm.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/password")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    // 1) 비밀번호 재설정 이메일 링크 요청
    @PostMapping("/reset-link")
    public ResponseEntity<String> sendResetLink(@RequestBody PasswordResetDto dto) {
        try {
            // userId, email만 사용
            passwordResetService.sendResetLink(dto.getUserId(), dto.getEmail());
            return ResponseEntity.ok("비밀번호 재설정 이메일을 전송했습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2) 토큰으로 비밀번호 변경 요청
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetDto dto) {
        try {
            // token, newPassword만 사용
            passwordResetService.resetPassword(dto.getToken(), dto.getNewPassword());
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
