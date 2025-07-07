package com.kh.sowm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


//포인트 point-history
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "VACATION")
public class Vacation {

    //시퀀스
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VACATION_NO")
    private Long vacationNo;

    //유저아이디
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    //사유
    @Column(name = "REASON", nullable = false, length = 100)
    private String reason;

    //내역 날짜
    @Column(name = "GRANTED_DATE", nullable = false)
    private LocalDate grantedDate;

    //휴가 지급 개수
    @Column(name = "AMOUNT", nullable = false)
    private Integer amount;

    @PrePersist
    public void prePersist() {
        if (this.grantedDate == null) {
            this.grantedDate = LocalDate.now();
        }
        if (this.amount == null) {
            this.amount = 1;
        }


    }
}