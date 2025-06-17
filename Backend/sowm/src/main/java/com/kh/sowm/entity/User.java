package com.kh.sowm.entity;


import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "USERS")
public class User {

    // 직원 아이디
    @Id
    @Column(name = "USER_ID", length = 30, unique = true, nullable = false)
    private String userId;

    // 직원 비밀번호
    @Column(length = 100, nullable = false)
    private String userPwd;

    // 직원 이름
    @Column(length = 50, nullable = false)
    private String userName;

    // 직원 이메일
    @Column(length = 100, unique = true)
    private String email;

    // 회원가입 날짜 (입사날짜)
    @Column(name = "CREATED_DATE")
    private LocalDateTime createdDate;

    // 계정 수정 날짜
    @Column(name = "UPDATED_DATE")
    private LocalDateTime updatedDate;

    // 총 누적 포인트
    private Integer point;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "JOB_CODE", nullable = false)
    private Job job;

    // 부서코드
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DEPT_CODE", nullable = false)
    private Department department;

    // 회사코드
    @Column(length = 6)
    private String companyCode;

    // 상태값
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    List<Board> boards = new ArrayList<>();

}
