package com.kh.sowm.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kh.sowm.entity.SubmitWorkation;
import com.kh.sowm.entity.User;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationImage;
import com.kh.sowm.entity.WorkationLocation;

import java.util.List;
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

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class WorkationDayDto{
        private String dayOff;

    }

    //이미지 디테일용  dto
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class WorkationImgDto{
        private String changedName;
        private String originalName;
        private String tab;
        private Long size;

    }

    //워케이션 디테일용 정보 전부 가져오기 dto
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ResponseDto {
        private String workationTitle;
        private String address;
        private String placeInfo;
        private String feature;
        private LocalDate workationStartDate;
        private LocalDate workationEndDate;
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
        private String changeName;
        private String tab;
        private List<WorkationImgDto> workationImages;
        private List<WorkationDayDto> dayOffs;

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
                    .workationImages(
                            workation.getWorkationImages().stream()
                                    .map(img -> new WorkationImgDto(img.getChangedName(),img.getOriginalName(), img.getTab().name(),  img.getSize()))
                                    .toList()
                    )
                    .dayOffs(workation.getDayOffs().stream().map(dayOff -> new WorkationDayDto(dayOff.getDayOff())).toList())
                    .build();
        }
    }

    //워케이션 정보 생성용 dto
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

    //이미지용 dto
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class WorkationImageDto{
        private String originalName;
        private String changedName;
        private String path;
        private Long size;
        private String tab;
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
        private List<WorkationImageDto> images;
        private List<String> selectedDays;

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
        private int peopleMin;
        private int peopleMax;
        private LocalDate workationStartDate;
        private LocalDate workationEndDate;
        private String placeImage;

        public WorkationBasicDto(Long locationNo, String address, String workationTitle, String userId, int peopleMin,
                                 int peopleMax, LocalDate workationStartDate, LocalDate workationEndDate,
                                 String placeImage) {
            this.locationNo = locationNo;
            this.workationTitle = workationTitle;
            this.address = address;
            this.userId = userId;
            this.peopleMin = peopleMin;
            this.peopleMax = peopleMax;
            this.workationStartDate = workationStartDate;
            this.workationEndDate = workationEndDate;
            this.placeImage = placeImage;
        }

        public static WorkationBasicDto from(Workation workation) {
            // PLACE 타입의 이미지 중 첫 번째 이미지 가져오기
            String placeImage = workation.getWorkationImages().stream()
                    .filter(img -> img.getTab() == WorkationImage.Tab.PLACE)
                    .map(WorkationImage::getChangedName) // 또는 getPath 등 경로/URL로
                    .findFirst()
                    .orElse(null);

            return WorkationBasicDto.builder()
                    .locationNo(workation.getWorkationLocation().getLocationNo())
                    .workationTitle(workation.getWorkationTitle())
                    .address(workation.getWorkationLocation().getAddress())
                    .userId(workation.getUser().getUserId())
                    .peopleMin(workation.getPeopleMin())
                    .peopleMax(workation.getPeopleMax())
                    .workationStartDate(workation.getWorkationStartDate())
                    .workationEndDate(workation.getWorkationEndDate())
                    .placeImage(placeImage)
                    .build();
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
        private WorkationsDto workation;
        private LocationsDto location;
        private String userId;
        private List<WorkationImageDto> images;
        private List<String> selectedDays;

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
    //워케이션 정보 생성용 dto
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WorkationUpdateDto {
        private WorkationsDto workation;
        private LocationsDto location;
        private String userId;
        private Long locationNo;
        private Long workationNo;
        private List<WorkationImageDto> images;
        private List<String> selectedDays;

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
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class WorkationNoDto {
        private Long workationNo;

    }

    //워케이션 신청 리스트
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WorkationSubListDto {
        private Long workationSubNo;
        private String workationTitle;
        private String userId;
        private int peopleMax;
        private LocalDate workationStartDate;
        private LocalDate workationEndDate;
        private String content;
        private String status;
        private String userName;


        public static WorkationSubListDto dto(SubmitWorkation workation) {
            return WorkationSubListDto.builder()
                    .workationSubNo(workation.getWorkationSubNo())
                    .workationTitle(workation.getWorkation().getWorkationTitle())
                    .userId(workation.getUser().getUserId())
                    .workationStartDate(workation.getStartDate())
                    .workationEndDate(workation.getEndDate())
                    .peopleMax(workation.getPeopleMax())
                    .content(workation.getContent())
                    .status(workation.getStatus().toString())
                    .userName(workation.getUser().getUserName())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class WorkationSubNoDto {
        private List<Long> workationSubNo;

    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class WorkationUserIdDto {
        private String userId;

    }


}
