package com.kh.sowm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "MEDICAL_CHECK_RESULT")
public class MedicalCheckResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MEDICAL_CHECK_RESULT_NO")
    private Long medicalCheckResultNo;

    @Column(name = "MEDICAL_CHECK_CREATE_DATE", nullable = false)
    private LocalDate medicalCheckCreateDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Column(name = "MEDICAL_CHECK_TOTAL_SCORE", nullable = false)
    private int medicalCheckTotalScore;

    @Column(name = "MEDICAL_CHECK_TYPE",nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private Type medicalCheckType;

    @Column(name = "GUIDE_MESSAGE", columnDefinition = "TEXT")
    private String guideMessage;
//
//    @OneToMany(mappedBy = "medicalCheckResult", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<MedicalCheckResult> medicalCheckResults = new ArrayList<>();

    @PrePersist
    public void prePersist(){
        if (this.medicalCheckCreateDate == null){
            this.medicalCheckCreateDate = LocalDate.now();
        }
    }

    public enum Type{
        PSYCHOLOGY, PHYSICAL;
    }


}