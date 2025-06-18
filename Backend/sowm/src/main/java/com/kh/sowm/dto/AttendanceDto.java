package com.kh.sowm.dto;

import lombok.*;

public class AttendanceDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class UserIdRequest {
        private String userId;

    }
}
