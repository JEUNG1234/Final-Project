package com.kh.sowm.dto;

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
        private String mainFeatures;
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

        public static ResponseDto toDto(Workation workation) {
            return ResponseDto.builder()
                    .workationTitle(workation.getWorkationTitle())
                    .facilityInfo(workation.getFaciltyInfo())
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
        private String mainFeatures;
        private LocalDate workationStartDate;
        private LocalDate workationEndDate;
        private String facilityInfo;
        private int peopleMin;
        private int peopleMax;
        private String url;
        private String precautions;
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
        private WorkationDto.WorkationsDto workation;
        private WorkationDto.LocationsDto location;

        public Workation toEntity() {
            return Workation.builder()
                    .workationTitle(workation.getWorkationTitle())
                    .faciltyInfo(workation.getFacilityInfo())
                    .workationStartDate(workation.getWorkationStartDate())
                    .workationEndDate(workation.getWorkationEndDate())
                    .peopleMin(workation.getPeopleMin())
                    .peopleMax(workation.getPeopleMax())
                    .URL(workation.getUrl())
                    .precautions(workation.getPrecautions())
                    .build();
        }

        public WorkationLocation toLocationEntity() {
            return WorkationLocation.builder()
                    .placeInfo(location.getPlaceInfo())
                    .address(location.getAddress())
                    .openHours(location.getOpenHours())
                    .spaceType(location.getSpaceType())
                    .area(location.getArea())
                    .busInfo(location.getBusInfo())
                    .parkingInfo(location.getParkingInfo())
                    .latitude(location.getLatitude())
                    .longitude(location.getLongitude())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class RequestDto {
        private String workationTitle;
        private String placeImage;
        private String address;
        private String placeInfo;
        private String mainFeatures;
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

        public Workation createDto(){
            return Workation.builder()
                    .workationTitle(this.workationTitle)
                    .faciltyInfo(this.facilityInfo)
                    .workationStartDate(this.workationStartDate)
                    .workationEndDate(this.workationEndDate)
                    .peopleMin(this.peopleMin)
                    .peopleMax(this.peopleMax)
                    .URL(this.url)
                    .precautions(this.precautions)
                    .build();
        }

        public WorkationLocation locationCreateDto(){
            return WorkationLocation.builder()
                    .placeInfo(this.placeInfo)
                    .address(this.address)
                    .openHours(this.openHours)
                    .spaceType(this.spaceType)
                    .area(this.area)
                    .parkingInfo(this.parkingInfo)
                    .busInfo(this.busInfo)
                    .latitude(this.latitude)
                    .longitude(this.longitude)
                    .build();
        }

    }
}
