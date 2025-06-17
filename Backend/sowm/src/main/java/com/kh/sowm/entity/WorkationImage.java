package com.kh.sowm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "WORKATION_IMAGE")
public class WorkationImage {
    @Id
    private Long fileNo;
    private Long locationNo;
    private String originalName;
    private String changedName;
    private String path;
    private Long size;
    private LocalDate uploadDate;
    private String status;
    private int level;
}