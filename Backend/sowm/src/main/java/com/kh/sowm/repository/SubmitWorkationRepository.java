package com.kh.sowm.repository;

import com.kh.sowm.dto.WorkationDto.WorkationNoDto;
import com.kh.sowm.dto.WorkationDto.WorkationSubListDto;
import com.kh.sowm.dto.WorkationDto.WorkationSubNoDto;
import com.kh.sowm.entity.SubmitWorkation;
import com.kh.sowm.entity.SubmitWorkation.StatusType;
import com.kh.sowm.entity.Workation;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;

public interface SubmitWorkationRepository {
    List<SubmitWorkation> findByStatus(StatusType statusType, String companyCode);

    //워케이션 신청리스트
    List<WorkationSubNoDto> findByworkationSubNo(List<WorkationNoDto> workationNoDtos);


    Optional<SubmitWorkation> findById(Long subNo);

    //워케이션 승인
    void approvedUpdate(SubmitWorkation submit);

    //워케이션 거절
    void returnUpdate(SubmitWorkation submit);

    List<SubmitWorkation> findById(String userId);
}
