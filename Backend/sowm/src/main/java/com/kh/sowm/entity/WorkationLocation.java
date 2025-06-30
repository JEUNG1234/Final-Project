package com.kh.sowm.entity;


import com.kh.sowm.dto.WorkationDto;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "WORKATION_LOCATION")
public class WorkationLocation {

    //장소 고유 번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LOCATION_NO")
    private Long locationNo;

    //장소 소개
    @Column(name = "PLACE_INFO", columnDefinition = "TEXT")
    @Lob
    private String placeInfo;

    //주소
    @Column(name = "ADDRESS",  length = 50, nullable = false)
    private String address;

    //운영시간
    @Column(name = "OPEN_HOURS",  length = 20, nullable = false)
    private String openHours;

    //공간 유형
    @Column(name = "SPACE_TYPE",  length = 50)
    private String spaceType;

    //면적
    @Column(name = "AREA")
    private Integer area;

    //특징
    @Column(name = "FEATURE", columnDefinition = "TEXT")
    @Lob
    private String feature;

    //위도
    @Column(name = "LATITUDE", nullable = false)
    private double latitude;

    //경도
    @Column(name = "LONGITUDE", nullable = false)
    private double longitude;

    //버스정보
    @Column(name = "BUS_INFO", columnDefinition = "TEXT")
    @Lob
    private String busInfo;

    //주차정보
    @Column(name = "PARKING_INFO", columnDefinition = "TEXT")
    @Lob
    private String parkingInfo;

    public void updateFromDto(WorkationDto.LocationsDto dto) {
        this.placeInfo = dto.getPlaceInfo();
        this.address = dto.getAddress();
        this.openHours = dto.getOpenHours();
        this.spaceType = dto.getSpaceType();
        this.area = dto.getArea();
        this.feature = dto.getFeature();
        this.busInfo = dto.getBusInfo();
        this.parkingInfo = dto.getParkingInfo();
        this.latitude = dto.getLatitude();
        this.longitude = dto.getLongitude();
    }

}
