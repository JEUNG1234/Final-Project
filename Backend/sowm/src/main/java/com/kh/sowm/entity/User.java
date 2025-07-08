package com.kh.sowm.entity;


import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.Collection;
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
    @Column(name = "CREATED_DATE", nullable = false)
    private LocalDate createdDate;

    // 계정 수정 날짜
    @Column(name = "UPDATED_DATE", nullable = false)
    private LocalDate updatedDate;

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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COMPANY_CODE", insertable = false, updatable = false)
    private Company company;

    @Column(name = "COMPANY_CODE", nullable = false)
    private String companyCode;

    @Column(name = "VACATION")
    private Integer vacation;

    // 상태값
    @Column(length = 1, nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    List<Board> boards = new ArrayList<>();

    // 마이페이지 이미지
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CURRENT_PROFILE_IMAGE_ID")
    private ProfileImage currentProfileImage;


    @PrePersist
    public void prePersist() {
        if (this.createdDate == null) {
            this.createdDate = LocalDate.now();
        }
        if (this.updatedDate == null) {
            this.updatedDate = LocalDate.now();
        }
        if (this.job == null) {
            this.job = Job.defaultJob();
        }
        if (this.department == null) {
            this.department = Department.defaultDepartment();
        }
        if (this.point == null) {
            this.point = 0;
        }
        if (this.status == null) {
            this.status = CommonEnums.Status.N;
        }
        if (this.vacation == null) {
            this.vacation = 15;
        }
    }

    @OneToMany(mappedBy = "writer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vote> votes = new ArrayList<>();


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VoteUser> voteUsers = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MedicalCheckResult> medicalCheckResults = new ArrayList<>();

    public void updateStatus(CommonEnums.Status newStatus, Job newJob) {
        this.status = newStatus;
        this.updatedDate = LocalDate.now();
        if(newJob != null) {
            this.job = newJob;
        }
    }

    // 직급 변경 메서드
    public void changeJob(Job newJob) {
        this.job = newJob;
    }

    public void changeDepartment(Department newDepartment) {
        this.department = newDepartment;
    }

    // 회원정보 수정할 때 사용할 메소드
    public void changeUserInfo(String newName, String newPassword) {
        this.userName = newName;
        this.userPwd = newPassword;
    }

    public void addPoints(int points) {
        if (this.point == null) {
            this.point = 0;
        }
        this.point += points;
    }

    public void deductPoints(int points) {
        if (this.point == null) {
            this.point = 0;
        }
        this.point -= points;
    }

    public ProfileImage getOldImg() {
        return this.currentProfileImage;
    }

    public void updateProfileImg(ProfileImage newImg) {
        this.currentProfileImage = newImg;
        this.updatedDate = LocalDate.now();
    }

    public void minusVacation(int days) {
        if (this.vacation < days) {
            throw new IllegalArgumentException("남은 휴가일수가 부족합니다.");
        }
        this.vacation -= days;
    }
}