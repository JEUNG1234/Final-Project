package com.kh.sowm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "HEALTH_DATA")
public class HealthData {
    @Id
    private Long healthDataNo;
    private LocalDate recordDate;
    private double sleepHours;
    private int stressLevel;
    private int location;
    private LocalDate createdDate;
    private String userId;
}