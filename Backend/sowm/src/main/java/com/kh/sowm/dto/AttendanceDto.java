package com.kh.sowm.dto;

import com.kh.sowm.entity.Attendance;
import com.kh.sowm.entity.Company;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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
        private String companyCode;
        private String userId;
        private String userName;
        private String deptName;
        private String jobName;
        private Double workHours;          // 근무 시간
        private String status;// 상태 (출근, 지각, 조퇴 등)

        public static List<Record> toEntity(List<Attendance> list) {
            if (list == null || list.isEmpty()) {
                return List.of();
            }

            return list.stream()
                    .map(a -> Record.builder()
                            .attendanceNo(a.getAttendanceNo().intValue())
                            .attendTime(a.getAttendTime())
                            .leaveTime(a.getLeaveTime())
                            .userId(a.getUser().getUserId())
                            .userName(a.getUser().getUserName())
                            .deptName(a.getUser().getDepartment().getDeptName())
                            .workHours(a.getWorkHours())
                            .status(a.getStatus().name())
                            .build())
                    .toList();
        }

        public static Record toDto(Attendance a) {
            return Record.builder()
                    .attendanceNo(a.getAttendanceNo().intValue())
                    .attendTime(a.getAttendTime())
                    .leaveTime(a.getLeaveTime())
                    .userId(a.getUser().getUserId())
                    .userName(a.getUser().getUserName())
                    .deptName(a.getUser().getDepartment().getDeptName())
                    .workHours(a.getWorkHours())
                    .status(a.getStatus().name())
                    .build();
        }

        public static Record pageDto(Attendance attendance) {
            return Record.builder()
                    .attendanceNo(attendance.getAttendanceNo().intValue())
                    .attendTime(attendance.getAttendTime())
                    .leaveTime(attendance.getLeaveTime())
                    .deptName(attendance.getUser().getDepartment().getDeptName())
                    .companyCode(attendance.getUser().getCompany().getCompanyCode())
                    .userName(attendance.getUser().getUserName())
                    .userId(attendance.getUser().getUserId())
                    .workHours(attendance.getWorkHours())
                    .status(attendance.getStatus().name())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class UpdateRequest {
        private Long attendanceNo;       // 어떤 출퇴근 기록을 수정할지
        private String userId;           // 어떤 유저의 기록인지
        private LocalDateTime attendTime;  // 새 출근 시간
        private LocalDateTime leaveTime;   // 새 퇴근 시간
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public class AttendanceSearchRequest {
        private String date;       // "2025-06-23" (yyyy-MM-dd)
        private String userName;   // 직원명 (optional)
        private String deptName;   // 부서명 (optional)
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class WeeklyAttendanceDto {
        private String day;       // "월", "화", "수", ...
        private int normal;       // 정상 출근 인원 수
        private int late;         // 지각 인원 수
        private int absent;       // 결근 인원 수
        private int vacation;     // 휴가/워케이션 인원 수
    }


}
