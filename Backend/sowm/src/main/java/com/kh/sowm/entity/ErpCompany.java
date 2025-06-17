package com.kh.sowm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "ERPCOMPANY")
public class ErpCompany {
    @Id
    private int companyCode;
    private String companyName;
    private String companyPhone;
    private String companyAddress;
    private LocalDate createdDate;
}