package com.kh.sowm.entity;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Job {

    @Id
    private Integer jobCode;


    private String jobName;
}
