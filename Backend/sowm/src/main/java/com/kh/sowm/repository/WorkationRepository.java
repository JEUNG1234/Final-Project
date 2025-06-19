package com.kh.sowm.repository;

import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;
import com.kh.sowm.enums.CommonEnums;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface WorkationRepository {

   Workation save(Workation workation);

   ResponseEntity<List<WorkationDto.WorkationBasicDto>> findByList();

   List<Workation> findByStatus(CommonEnums.Status status);

   WorkationDto.ResponseDto findByInfo(int locationNo);
}

