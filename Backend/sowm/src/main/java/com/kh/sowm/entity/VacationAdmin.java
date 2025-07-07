package com.kh.sowm.entity;


import com.kh.sowm.entity.SubmitWorkation.StatusType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "VACATION_ADMIN")
public class VacationAdmin {

    //휴가 신청 고유 번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VACATION_NO")
    private Long vacationNo;

    //휴가 시작 날짜
    @Column(name = "START_DATE", nullable = false)
    private LocalDate startDate;

    //휴가 종료 날짜
    @Column(name = "END_DATE", nullable = false)
    private LocalDate endDate;

    //휴가 신청 날짜
    @Column(name = "VACATION_DATE", nullable = false)
    private LocalDate vacationDate;

    //사용 휴가 일수
    @Column(name = "AMOUNT", nullable = false)
    private Integer  amount;

    @Column(name = "CONTENT")
    private String content;

    //승인상태 값
    @Column(length = 1, nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusType status;

    //직원아이디
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    //승인상태값 default = W
    @PrePersist
    public void prePersist() {
        if (this.vacationDate == null) {
            this.vacationDate = LocalDate.now();
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
