package com.kh.sowm.dto;

import com.kh.sowm.entity.VacationAdmin;
import com.kh.sowm.entity.VacationAdmin.StatusType;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class VacationAdminDto {

    // 클라이언트 -> 서버로 요청에 대한 응답 Dto
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ResponseDto {
        private Long vacationNo;
        private LocalDate startDate;
        private LocalDate endDate;
        private LocalDate vacationDate;
        private int amount;
        private String content;
        private VacationAdmin.StatusType status;
        private String userName;

        public ResponseDto(VacationAdmin entity) {
            this.vacationNo = entity.getVacationNo();
            this.startDate = entity.getStartDate();
            this.endDate = entity.getEndDate();
            this.vacationDate = entity.getVacationDate();
            this.amount = entity.getAmount();
            this.content = entity.getContent();
            this.status = entity.getStatus();
            this.userName = entity.getUser().getUserName();
        }
    }

    // 클라이언트 -> 서버 -> 다시 클라이언트로 요청을 보낼 요청 Dto
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class RequestDto {
        private List<Long> vacationNos;
        private StatusType status;
        private String companyCode;
    }
}
