package com.kh.sowm.dto;

import lombok.*;

public class DepartmentDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @Builder
    public static class ResponseDto{
        private String deptName;

        public ResponseDto(String deptName) {
            this.deptName = deptName;
        }
    }
}
