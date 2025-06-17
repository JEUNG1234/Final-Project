package com.kh.sowm.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "MEDICAL_CHECK_HEAD_SCORE")
public class MedicalCheckHeadScore {

    //항목번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HEAD_NO")
    private Long headNo;

    //검사 결과번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEDICAL_CHECK_RESULT_NO")
    private MedicalCheckResult medicalCheckResult;


    //항목점수
    @Column(name = "HEAD_SCORE", nullable = false)
    private Integer headScore;


    //만약 점수가 null일 시 최소값 1그게 아닐경우 입력한 값 입력
    @PrePersist
    public void prePersist() {
        this.headScore = headScore == null ? 1 : headScore;
    }

}
