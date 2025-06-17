package com.kh.sowm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ErpCompany {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COMPANY_CODE")
    private Integer companyCode;


    @Column(name = "COMPANY_NAME", length = 30, nullable = false)
    private String companyName;

    @Column(name = "COMPANY_ADDRESS",length = 100)
    private String companyAddress;

    @Column(name = "COMPANY_PHONE", length = 11)
    private String companyPhone;

    @Column(name = "CREATED_DATE", nullable = false)
    private LocalDateTime createDate;
}
