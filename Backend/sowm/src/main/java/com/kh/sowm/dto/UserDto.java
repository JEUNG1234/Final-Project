package com.kh.sowm.dto;

import com.kh.sowm.entity.User;
import lombok.*;

import java.time.LocalDateTime;

public class UserDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ResponseDto {
        private String userId;
        private String userPwd;
        private String userName;
        private String email;
        private LocalDateTime createdDate;
        private LocalDateTime updatedDate;
        private Integer point;
        private Integer jobCode;
        private Integer deptCode;

        public static ResponseDto toDto(User user){
            return ResponseDto.builder()
                    .userId(user.getUserId())
                    .userName(user.getUserName())
                    .email(user.getEmail())
                    .userPwd(user.getUserPwd())
                    .point(user.getPoint())
                    .jobCode(user.getJobCode())
                    .build();
        }

        // 마이페이지 정보 가져오는 dto
        public static ResponseDto getLoginUserDto(User user){
            return ResponseDto.builder()
                    .userId(user.getUserId())
                    .userPwd(user.getUserPwd())
                    .userName(user.getUserName())
                    .email(user.getEmail())
                    .jobCode(user.getJobCode())
                    .deptCode(user.getDeptCode())
                    .createdDate(user.getCreatedDate())
                    .updatedDate(user.getUpdatedDate())
                    .point(user.getPoint())
                    .build();
        }
    }
}
