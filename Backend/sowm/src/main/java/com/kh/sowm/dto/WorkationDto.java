package com.kh.sowm.dto;


import com.kh.sowm.entity.SubmitWorkation;
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
    public static class UserCompanyRequest {
        private String userCompanyCode;

    }

    //워케이션 디테일용 정보 전부 가져오기 dto
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

    //워케이션 정보 생성요 dto
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


    //워케이션 정보 생성용 dto
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

    //워케이션 리스트 카드정보용 dto
    @Getter
    @Setter
    @NoArgsConstructor
    @Builder
    public static class WorkationBasicDto {
        private Long locationNo;
        private String workationTitle;
        private String address;
        private String userId;
        //        private String placeImage; 이미지는 추후에 추가 예정

        public WorkationBasicDto(Long locationNo, String address, String workationTitle, String userId) {
            this.locationNo = locationNo;
            this.workationTitle = workationTitle;
            this.address = address;
            this.userId = userId;


        }


    }

    //워케이션 신청용 dto
    @Getter
    @Setter
    @NoArgsConstructor
    public static class SubWorkation {
        private Long workationNo;
        private String location;
        private String content;
        private int peopleMax;
        private LocalDate startDate;
        private LocalDate endDate;
        private String userId;

        public SubmitWorkation subWorkationDto(User user, Workation workation) {
            return  SubmitWorkation.builder()
                    .workation(workation)
                    .location(this.location)
                    .content(this.content)
                    .peopleMax(this.peopleMax)
                    .startDate(this.startDate)
                    .endDate(this.endDate)
                    .user(user)
                    .build();


        }

    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ResponseUpdateDto {
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
        private Long locationNo;
        private Long workationNo;

        public static ResponseUpdateDto toDto(Workation workation) {
            return ResponseUpdateDto.builder()
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
                    .locationNo(workation.getWorkationNo())
                    .workationNo(workation.getWorkationNo())
                    .build();
        }
    }
    //워케이션 정보 생성용 dto
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkationUpdateDto {
        private WorkationsDto workation;
        private LocationsDto location;
        private String userId;
        private Long locationNo;
        private Long workationNo;

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


        public void updatedWorkationDto(ResponseUpdateDto updatedWorkationDto){
            WorkationDto.ResponseUpdateDto.builder()
                    .workationTitle(updatedWorkationDto.getWorkationTitle())
                    .placeImage(updatedWorkationDto.getPlaceImage())
                    .address(updatedWorkationDto.getAddress())
                    .placeInfo(updatedWorkationDto.getPlaceInfo())
                    .feature(updatedWorkationDto.getFeature())
                    .workationStartDate(updatedWorkationDto.getWorkationStartDate())
                    .workationEndDate(updatedWorkationDto.getWorkationEndDate())
                    .facilityImage(updatedWorkationDto.getFacilityImage())
                    .facilityInfo(updatedWorkationDto.getFacilityInfo())
                    .openHours(updatedWorkationDto.getOpenHours())
                    .spaceType(updatedWorkationDto.getSpaceType())
                    .area(updatedWorkationDto.getArea())
                    .peopleMin(updatedWorkationDto.getPeopleMin())
                    .peopleMax(updatedWorkationDto.getPeopleMax())
                    .url(updatedWorkationDto.getUrl())
                    .precautions(updatedWorkationDto.getPrecautions())
                    .busInfo(updatedWorkationDto.getBusInfo())
                    .parkingInfo(updatedWorkationDto.getParkingInfo())
                    .latitude(updatedWorkationDto.getLatitude())
                    .longitude(updatedWorkationDto.getLongitude())
                    .userId(updatedWorkationDto.getUserId());
        }
    }
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class WorkationNoDto {
        private Long workationNo;

    }


}
