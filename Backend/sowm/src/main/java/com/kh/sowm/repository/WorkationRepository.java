package com.kh.sowm.repository;

import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.entity.SubmitWorkation;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.enums.CommonEnums;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;


public interface WorkationRepository {

   //워케이션 생성
   Workation save(Workation workation);


   //스테이터스가 Y인 것을 조회
   List<Workation> findByStatus(CommonEnums.Status status, String companyCode);

   //워케이션 정보 조회
   WorkationDto.ResponseDto findByInfo(int locationNo);

   //워케이션NO조회
   Optional<Workation> findByWorkationNo(Long workationNo);

   //워케이션 신청
   SubmitWorkation save(SubmitWorkation subWork);

   //워케이션 수정용
   Workation updateWorkation(Workation workation);

   Workation updateWorkationStatus(Long workationNo);
}

