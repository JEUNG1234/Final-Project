package com.kh.sowm.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "JOB")
public class Job {
    @Id
    @Column(name = "JOB_CODE")
    private String jobCode;

    // 직원 회원가입시 디폴트 직급코드
    public static Job defaultJob() {
        Job job = new Job();
        job.jobCode = "J0"; // 외부인
        return job;
    }

    // 관리자 회원가입시 디폴트 직급코드
    public static Job adminDefaultJob() {
        Job job = new Job();
        job.jobCode = "J2"; // 관리자
        return job;
    }

    @Column(name = "JOB_NAME")
    private String jobName;
}