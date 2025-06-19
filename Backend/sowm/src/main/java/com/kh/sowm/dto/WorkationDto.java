package com.kh.sowm.dto;


import com.kh.sowm.entity.User;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;

import lombok.*;

import java.time.LocalDate;

public class WorkationDto {



    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ResponseDto {
        private String workationTitle;
        private String placeImage;
        private String address;
        private String placeInfo;
        private String feature;
        private LocalDate workationStartDate;
        private LocalDate workationEndDate;
        private String facilityImage;
        private String facilityInfo;
        private String openHours;
        private String spaceType;
        private int area;
        private int peopleMin;
        private int peopleMax;
        private String url;
        private String precautions;
        private String busInfo;
        private String parkingInfo;
        private double latitude;
        private double longitude;
        private String userId;


        public static ResponseDto toDto(Workation workation) {
            return ResponseDto.builder()
                    .workationTitle(workation.getWorkationTitle())
                    .address(workation.getWorkationLocation().getAddress())
                    .feature(workation.getWorkationLocation().getFeature())
                    .placeInfo(workation.getWorkationLocation().getPlaceInfo())
                    .openHours(workation.getWorkationLocation().getOpenHours())
                    .spaceType(workation.getWorkationLocation().getSpaceType())
                    .area(workation.getWorkationLocation().getArea())
                    .busInfo(workation.getWorkationLocation().getBusInfo())
                    .parkingInfo(workation.getWorkationLocation().getParkingInfo())
                    .latitude(workation.getWorkationLocation().getLatitude())
                    .longitude(workation.getWorkationLocation().getLongitude())
                    .userId(workation.getUser().getUserId())
                    .facilityInfo(workation.getFacilityInfo())
                    .workationStartDate(workation.getWorkationStartDate())
                    .workationEndDate(workation.getWorkationEndDate())
                    .peopleMin(workation.getPeopleMin())
                    .peopleMax(workation.getPeopleMax())
                    .url(workation.getURL())
                    .precautions(workation.getPrecautions())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class WorkationsDto {
        private String workationTitle;
        private LocalDate workationStartDate;
        private LocalDate workationEndDate;
        private String facilityInfo;
        private int peopleMin;
        private int peopleMax;
        private String url;
        private String precautions;
        private String userId;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class LocationsDto {
        private String address;
        private String placeInfo;
        private String openHours;
        private String spaceType;
        private String feature;
        private int area;
        private String busInfo;
        private String parkingInfo;
        private double latitude;
        private double longitude;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkationCreateDto {
        private WorkationsDto workation;
        private LocationsDto location;
        private String userId;


        public Workation toWorkationEntity(User user) {
            return Workation.builder()
                    .user(user)
                    .workationTitle(this.workation.getWorkationTitle())
                    .facilityInfo(this.workation.getFacilityInfo())
                    .workationStartDate(this.workation.getWorkationStartDate())
                    .workationEndDate(this.workation.getWorkationEndDate())
                    .peopleMin(this.workation.getPeopleMin())
                    .peopleMax(this.workation.getPeopleMax())
                    .URL(this.workation.getUrl())
                    .precautions(this.workation.getPrecautions())
                    .build();
        }

        public WorkationLocation toLocationEntity() {
            return WorkationLocation.builder()
                    .placeInfo(location.getPlaceInfo())
                    .address(location.getAddress())
                    .openHours(location.getOpenHours())
                    .spaceType(location.getSpaceType())
                    .area(location.getArea())
                    .feature(location.getFeature())
                    .busInfo(location.getBusInfo())
                    .parkingInfo(location.getParkingInfo())
                    .latitude(location.getLatitude())
                    .longitude(location.getLongitude())
                    .build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @Builder
    public static class WorkationBasicDto {
        private Long locationNo;
        private String workationTitle;
        private String address;
        //        private String placeImage; 이미지는 추후에 추가 예정

        public WorkationBasicDto(Long locationNo, String address, String workationTitle) {
            this.locationNo = locationNo;
            this.workationTitle = workationTitle;
            this.address = address;


        }

    }


}
