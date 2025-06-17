package com.kh.sowm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "WORKATION")
public class Workation {
    @Id
    private Long locationNo;
    private String userId;
    private String programTitle;
    private String locationName;
    private String locationIntroduce;
    private String facilityInformation;
    private String caution;
    private String address;
    private LocalDate createdDate;
    private LocalDate updatedDate;
    private LocalDate programStartDate;
    private LocalDate programFinishDate;
    private String programStatus;
}