package com.kh.sowm.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Table(name = "DAY_OFF")
public class DayOff {
    //휴무일번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DAY_OFF_NO")
    private Long dayOffNo;

    //휴무 요일
    @Column(name = "DAY_OFF", nullable = false)
    private String dayOff;

    //워케이션 고유 번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WORKATION_NO", nullable = false)
    private Workation workation;
}
