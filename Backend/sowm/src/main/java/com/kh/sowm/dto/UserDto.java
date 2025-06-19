package com.kh.sowm.dto;

import com.kh.sowm.entity.Department;
import com.kh.sowm.entity.Job;
import com.kh.sowm.entity.User;
import lombok.*;

import java.time.LocalDate;

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
        private LocalDate createdDate;
        private LocalDate updatedDate;
        private Integer point;
        private String jobCode;
        private String deptCode;
        private String companyCode;
        private String status;

        public static ResponseDto toDto(User user){
            return ResponseDto.builder()
                    .userId(user.getUserId())
                    .userName(user.getUserName())
                    .email(user.getEmail())
                    .userPwd(user.getUserPwd())
                    .point(user.getPoint())
                    .jobCode(user.getJob().getJobCode())
                    .createdDate(user.getCreatedDate())
                    .updatedDate(user.getUpdatedDate())
                    .deptCode(user.getDepartment().getDeptCode())
                    .companyCode(user.getCompanyCode())
                    .status(String.valueOf(user.getStatus()))
                    .build();
        }

        // 마이페이지 정보 가져오는 dto
        public static ResponseDto getLoginUserDto(User user){
            return ResponseDto.builder()
                    .userId(user.getUserId())
                    .userPwd(user.getUserPwd())
                    .userName(user.getUserName())
                    .email(user.getEmail())
                    .jobCode(user.getJob().getJobCode())
                    .deptCode(user.getDepartment().getDeptCode())
                    .createdDate(user.getCreatedDate())
                    .updatedDate(user.getUpdatedDate())
                    .point(user.getPoint())
                    .build();
        }

    }

    @Getter
    @Setter
    @ToString // 로깅 등을 위해 추가하면 좋습니다.
    public class EmployeeSearchCondition {
        private String companyCode;
        private String createdDate;
        private String userName;
        private String jobCode;
        private String deptCode;
        private String email;

    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    // 요청 Dto
    public static class RequestDto {
        private String userId;
        private String password;
        private String checkPassword;
        private String userName;
        private String email;
        private String companyCode;
        private String status;
        private String jobCode;
        private String deptCode;

        // 회원가입 dto
       public User signUp() {
           return User.builder()
                   .userId(this.userId)
                   .userPwd(this.password)
                   .userName(this.userName)
                   .email(this.email)
                   .companyCode(this.companyCode)
                   .job(Job.defaultJob())
                   .build();
       }

        public User adminSignUp() {
            return User.builder()
                    .userId(this.userId)
                    .userPwd(this.password)
                    .userName(this.userName)
                    .email(this.email)
                    .companyCode(this.companyCode)
                    .job(Job.adminDefaultJob())
                    .build();
        }
    }
}
