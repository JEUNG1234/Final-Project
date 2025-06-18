package com.kh.sowm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "COMPANY")
public class Company {

    @Id
    @Column(name = "COMPANY_CODE")
    private String companyCode;

    @Column(name = "COMPANY_NAME")
    private String companyName;

    @Column(name = "COMPANY_PHONE")
    private String companyPhone;

    @Column(name = "COMPANY_ADDRESS")
    private String companyAddress;

    @Column(name = "CREATED_DATE")
    private LocalDate createdDate;


    @PrePersist
    public void prePersist() {
        if (createdDate == null) {
            createdDate = LocalDate.now();
        }
    }
}
