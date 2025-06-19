package com.kh.sowm.service;

import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface WorkationService {

//    WorkationDto.ResponseDto enrollWorkation(String userId, WorkationDto.WorkationsDto workationDto, WorkationDto.LocationsDto locationDto, MultipartFile placeImage, MultipartFile facilityImage, MultipartFile precautionImage);

    //워케이션 리스트 조회용
    ResponseEntity<List<WorkationDto.WorkationBasicDto>> workationList();

    WorkationDto.ResponseDto enrollWorkation(WorkationDto.WorkationCreateDto request);
}
