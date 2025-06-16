package com.kh.sowm.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "ATTENDANCE")
public class Attendance {
    @Id
    private Long attendanceNo;
    private String userId;
    private LocalDateTime attendTime;
    private LocalDateTime leaveTime;
    private String status;
    private Double workHours;
}