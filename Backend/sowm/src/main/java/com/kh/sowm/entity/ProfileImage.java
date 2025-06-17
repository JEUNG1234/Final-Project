package com.kh.sowm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "PROFILE_IMAGE")
public class ProfileImage {
    @Id
    private Long fileNo;
    private String originalName;
    private String changedName;
    private String path;
    private Long size;
    private LocalDate uploadDate;
    private String status;
    private String userId;
}