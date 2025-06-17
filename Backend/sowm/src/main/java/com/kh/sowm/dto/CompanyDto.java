package com.kh.sowm.dto;

import com.kh.sowm.entity.Company;
import com.kh.sowm.entity.User;
import lombok.*;

import java.time.LocalDate;

public class CompanyDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    // 요청 Dto
    public static class RequestDto {
        private String companyCode;
        private String companyPhone;
        private String companyName;
        private LocalDate createdDate;
        private String companyAddress;

        // 회사신청
        public Company enrollCompany() {
            return Company.builder()
                    .companyCode(this.companyCode)
                    .companyName(this.companyName)
                    .companyPhone(this.companyPhone)
                    .createdDate(LocalDate.now())
                    .companyAddress(this.companyAddress).build();
        }
    }
}
