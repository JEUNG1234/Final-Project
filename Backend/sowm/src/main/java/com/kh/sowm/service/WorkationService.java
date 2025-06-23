package com.kh.sowm.service;

import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.entity.SubmitWorkation;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface WorkationService {
    //워케이션 리스트 조회용
    ResponseEntity<List<WorkationDto.WorkationBasicDto>> workationList(String companyCode);

    //워케이션 생성
    WorkationDto.ResponseDto enrollWorkation(WorkationDto.WorkationCreateDto request);

    //워케이션 정보 디테일
    WorkationDto.ResponseDto workationInfo(int locationNo);

    //워케이션 신청용
    WorkationDto.SubWorkation submit(WorkationDto.SubWorkation subWork);

    WorkationDto.ResponseDto updateWorkation(WorkationDto.WorkationUpdateDto request);
}
