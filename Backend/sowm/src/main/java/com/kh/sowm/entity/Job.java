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
    private String jobCode;
    private String jobName;
}