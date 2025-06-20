package com.kh.sowm.entity;

import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "SUBMIT_WORKATION")
public class SubmitWorkation {

    //신청 고유 번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "WORKATION_SUB_NO")
    private Long workationSubNo;

    //워케이션 시작일
    @Column(name = "START_DATE", nullable = false)
    private LocalDate startDate;

    //워케이션 종료일
    @Column(name = "END_DATE", nullable = false)
    private LocalDate endDate;

    //워케이션 신청일
    @Column(name = "WORKATION_DATE", nullable = false)
    private LocalDate workationDate;

    //장소
    @Column(name = "LOCATION", nullable = false)
    private String location;

    //최대인원
    @Column(name = "PEOPLE_MAX", nullable = false)
    private Integer peopleMax;

    //사유
    @Column(name = "CONTENT", nullable = false)
    private String content;


    //승인상태 값
    @Column(length = 1, nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusType status;

    //워케이션 (장소)고유번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "LOCATION_NO", nullable = false)
    private Workation workation;

    //직원아이디
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;


    //승인상태값 default = W
    @PrePersist
    public void prePersist() {
        if (this.workationDate == null) {
            this.workationDate = LocalDate.now();
        }
        if (this.status == null) {
            this.status = StatusType.W;
        }
    }
    //승인상태값 Y=승인. W=대기, N=반려
    public enum StatusType{
        Y, W, N;
    }

}