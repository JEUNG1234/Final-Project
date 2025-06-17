package com.kh.sowm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "MEDICAL_CHECK_RESULT")
public class MedicalCheckResult {
    @Id
    private Long medicalCheckResultNo;
    private LocalDate medicalCheckCreateDate;
    private String userId;
    private int medicalCheckTotalScore;
    private int medicalCheckType;
}