package com.kh.sowm.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class User {

    @Id
    private String userId;


    private String userPwd;


    private String userName;


    private String email;


    private LocalDateTime createdDate;


    private LocalDateTime updatedDate;


    private Integer point;


    private Integer jobCode;


    private Integer deptCode;
}
