package com.kh.sowm.dto;

import lombok.*;

import java.time.LocalDateTime;

public class AttendanceDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class UserIdRequest {
        private String userId;

    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Record {
        private Integer attendanceNo;
        private LocalDateTime attendTime;  // 출근 시간
        private LocalDateTime leaveTime;   // 퇴근 시간
        private String userId;
        private Double workHours;          // 근무 시간
        private String status;             // 상태 (출근, 지각, 조퇴 등)
    }

}
