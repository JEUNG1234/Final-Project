package com.kh.sowm.service;

import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.dto.WorkationDto.ResponseDto;
import com.kh.sowm.dto.WorkationDto.WorkationSubListDto;
import com.kh.sowm.dto.WorkationDto.WorkationSubNoDto;
import com.kh.sowm.dto.WorkationDto.WorkationUpdateDto;
import com.kh.sowm.entity.Workation;
import org.springframework.http.ResponseEntity;

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

    //워케이션 수정용
    ResponseDto updateWorkation(WorkationUpdateDto request);

    //워케이션 삭제용
    Workation delete(Long workationNo);

    //워케이션 신청리스트 조회용
    ResponseEntity<List<WorkationSubListDto>> workationSubList(String companyCode);

    //워케이션 신청 승인용
    List<Long> workationSubUpdate(WorkationSubNoDto selectedIds);

    //워케이션 거절 승인용
    List<Long> workationReturnUpdate(WorkationSubNoDto selectedIds);

    //워케이션 유저가 신청한 신청목록 리스트 가져오기
    ResponseEntity<List<WorkationSubListDto>> workationMySubList(String userId);

    //워케이션 신청 취소
    List<Long> workationMyDelete(WorkationSubNoDto selectedIds);

    //워케이션 전체 리스트 불러오기
    ResponseEntity<List<WorkationSubListDto>> workationFullSubList(String companyCode);
}
