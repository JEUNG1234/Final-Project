package com.kh.sowm.entity;

import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;
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
    @Column(name = "FACILITY_INFO", columnDefinition = "TEXT")
    @Lob
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
    @Column(name = "PRECAUTIONS", columnDefinition = "TEXT")
    @Lob
    private String precautions;


//    여기는 장소고유번호 조인 컬럼
    @OneToOne
    @JoinColumn(name = "LOCATION_NO")
    private WorkationLocation workationLocation;

    @Builder.Default
    @OneToMany(mappedBy = "workation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WorkationImage> workationImages = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "workation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DayOff> dayOffs = new ArrayList<>();

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
    @PreUpdate
    public void preUpdate() {
        this.updatedDate = LocalDate.from(LocalDate.now());
    }


    public void assignUser(User user) {
        this.user = user;
    }

    public void setWorkationLocation(WorkationLocation savedLocation) {
        this.workationLocation = savedLocation;
    }

    public void updateFromDto(WorkationDto.WorkationsDto dto, User user) {
        this.user = user;
        this.workationTitle = dto.getWorkationTitle();
        this.facilityInfo = dto.getFacilityInfo();
        this.workationStartDate = dto.getWorkationStartDate();
        this.workationEndDate = dto.getWorkationEndDate();
        this.peopleMin = dto.getPeopleMin();
        this.peopleMax = dto.getPeopleMax();
        this.URL = dto.getUrl();
        this.precautions = dto.getPrecautions();
        // 기타 업데이트 항목들
    }

    //삭제시 상태값 변경
    public void setStatus(CommonEnums.Status status) {
        this.status = CommonEnums.Status.N;
    }
}