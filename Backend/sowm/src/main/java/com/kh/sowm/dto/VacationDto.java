package com.kh.sowm.dto;

import com.kh.sowm.entity.Vacation;
import com.kh.sowm.entity.VacationAdmin;
import com.kh.sowm.entity.VacationAdmin.StatusType;
import java.time.LocalDate;
import java.util.List;
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
        private Long vacationNo;
        private LocalDate vacationDate;
        private LocalDate startDate; // startDate 필드 추가
        private LocalDate endDate;   // endDate 필드 추가
        private String content;
        private Integer amount;
        private StatusType status;
        private String userName;

        // VacationAdmin -> Dto 변환 생성자 추가
        public VacationResponseDto(VacationAdmin vacationAdmin) {
            this.vacationDate = vacationAdmin.getVacationDate();
            this.startDate = vacationAdmin.getStartDate(); // startDate 매핑
            this.endDate = vacationAdmin.getEndDate();     // endDate 매핑
            this.content = vacationAdmin.getContent();
            this.amount = vacationAdmin.getAmount();
            this.userName = vacationAdmin.getUser().getUserName();
            this.status = StatusType.MINUS;
        }

        public VacationResponseDto(Vacation vacation) {
            this.vacationDate = vacation.getGrantedDate();
            this.startDate = vacation.getGrantedDate(); // 포인트 전환 휴가는 하루이므로 시작/종료일 동일
            this.endDate = vacation.getGrantedDate();
            this.content = vacation.getReason();
            this.amount = vacation.getAmount();
            this.userName = vacation.getUser().getUserName();
            this.status = StatusType.PLUS;
        }

        public enum StatusType {
            PLUS, MINUS
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class VacationWaitDto {
        private Long vacationNo;
        private LocalDate vacationDate;
        private String content;
        private Integer amount;
        private VacationAdmin.StatusType status;
        private String userName;

        public VacationWaitDto(VacationAdmin vacationAdmin) {
            this.vacationNo = vacationAdmin.getVacationNo();
            this.vacationDate = vacationAdmin.getVacationDate();
            this.content = vacationAdmin.getContent();
            this.amount = vacationAdmin.getAmount();
            this.userName = vacationAdmin.getUser().getUserName();
            this.status = vacationAdmin.getStatus();
        }
        public enum StatusType {
            PLUS, MINUS
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class VacationNoDto {
        private List<Long> vacationNos;
    }


}