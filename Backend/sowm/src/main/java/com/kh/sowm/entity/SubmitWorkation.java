package com.kh.sowm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "SUBMIT_WORKATION")
public class SubmitWorkation {
    @Id
    private Long workationNo;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate workationDate;
    private String location;
    private String status;
    private Long locationNo;
    private String userId;
}