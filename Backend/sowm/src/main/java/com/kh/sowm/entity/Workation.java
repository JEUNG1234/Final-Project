package com.kh.sowm.entity;

import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "WORKATION")
public class Workation {

    //워케이션 고유번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "WORKATION_NO")
    private Long workationNo;

    //직원 아이디
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    //워케이션 제목
    @Column(name = "WORKATION_TITLE", nullable = false, length = 100)
    private String workationTitle;

    //시설안내
    @Column(name = "FACILITY_INFO",  length = 100)
    private String facilityInfo;


    //작성날짜
    @Column(name = "CREATED_DATE", nullable = false)
    private LocalDate createdDate;

    //수정날짜
    @Column(name = "UPDATED_DATE", nullable = false)
    private LocalDate updatedDate;

    //워케이션 계약기간
    @Column(name = "WORKATION_START_DATE", nullable = false)
    private LocalDate workationStartDate;

    //워케이션 계약 종료날짜
    @Column(name = "WORKATION_END_DATE", nullable = false)
    private LocalDate workationEndDate;

    //상태값
    @Column(length = 1, nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;

    //수용인원(최소)
    @Column(name = "PEOPLE_MIN")
    private int peopleMin;

    //수용인원(최대)
    @Column(name = "PEOPLE_MAX")
    private int peopleMax;

    //사이트 주소
    @Column(name = "URL", length = 500)
    private String URL;

    //유의사항
    @Column(name = "PRECAUTIONS", length = 500)
    private String precautions;


//    여기는 장소고유번호 조인 컬럼
    @OneToOne
    @JoinColumn(name = "LOCATION_NO")
    private WorkationLocation workationLocation;



    @PrePersist
    public void prePersist(){
        if(createdDate == null){
            createdDate = LocalDate.now();
        }
        if(updatedDate == null){
            updatedDate = LocalDate.now();
        }
        if(this.status == null) {
            this.status = CommonEnums.Status.Y;

        }

    }


    public void assignUser(User user) {
        this.user = user;
    }

    public void setWorkationLocation(WorkationLocation savedLocation) {
        this.workationLocation = savedLocation;
    }
}