package com.kh.sowm.entity;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "JOB")
public class Job {

    @Id
    @Column(name = "JOB_CODE")
    private String jobCode;

    @Column(name = "JOB_NAME")
    private String jobName;
}
