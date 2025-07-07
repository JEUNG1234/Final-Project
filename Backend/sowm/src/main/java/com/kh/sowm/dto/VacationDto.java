package com.kh.sowm.dto;

import com.kh.sowm.entity.Vacation;
import com.kh.sowm.entity.VacationAdmin;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class VacationDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class VacationSubmitDto {
        private LocalDate startDate;
        private LocalDate endDate;
        private String content;
        private Integer  amount;
        private String userId;
    }



    @Getter
    @Setter
    @NoArgsConstructor
    public static class VacationResponseDto {
        private LocalDate vacationDate;
        private String content;
        private Integer amount;
        private StatusType status;

        // VacationAdmin -> Dto 변환 생성자 추가
        public VacationResponseDto(VacationAdmin vacationAdmin) {
            this.vacationDate = vacationAdmin.getVacationDate();
            this.content = vacationAdmin.getContent();
            this.amount = vacationAdmin.getAmount();
            this.status = StatusType.MINUS;
        }

        public VacationResponseDto(Vacation vacation) {
            this.vacationDate = vacation.getGrantedDate();
            this.content = vacation.getReason();
            this.amount = vacation.getAmount();
            this.status = StatusType.PLUS;

        }

        public enum StatusType {
            PLUS, MINUS
        }



    }


}
