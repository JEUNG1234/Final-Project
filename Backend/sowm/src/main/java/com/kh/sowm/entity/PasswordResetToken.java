package com.kh.sowm.entity;


import jakarta.persistence.*;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "PASSWORD_RESET_TOKEN")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(unique = true, nullable = false)
    private String token;

    private LocalDateTime expiryDate;

    public void generateExpiryDate() {
        this.expiryDate = LocalDateTime.now().plusMinutes(5); // 만료 시간 30분
    }

    public boolean isExpired() {
        return expiryDate.isBefore(LocalDateTime.now());
    }


}