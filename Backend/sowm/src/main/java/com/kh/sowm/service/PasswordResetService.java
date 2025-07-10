package com.kh.sowm.service;

public interface PasswordResetService {
    void sendResetLink(String userId, String email);
    void resetPassword(String token, String newPassword);
}
