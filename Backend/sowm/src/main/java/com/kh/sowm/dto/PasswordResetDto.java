package com.kh.sowm.dto;

import lombok.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetDto {
    private String userId;
    private String email;
    private String token;
    private String newPassword;
}

