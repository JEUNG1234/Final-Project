package com.kh.sowm.service;

import com.kh.sowm.dto.BoardDto.Response;
import com.kh.sowm.dto.MedicalCheckDto.MedicalCheckResultDto;
import com.kh.sowm.dto.MedicalCheckDto.MentalQuestionDto;
import com.kh.sowm.dto.MedicalCheckDto.MentalQuestionRequestDto;
import com.kh.sowm.dto.MedicalCheckDto.MentalResultDto;
import com.kh.sowm.dto.MedicalCheckDto.PhysicalQuestionDto;
import com.kh.sowm.dto.MedicalCheckDto.PhysicalQuestionRequestDto;
import com.kh.sowm.dto.MedicalCheckDto.PhysicalResultDto;
import com.kh.sowm.entity.MedicalCheckResult.Type;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface HealthService {
    MentalQuestionDto getMentalQuestion(MentalQuestionRequestDto requestDto, String userId);

    MentalResultDto getMentalCheckResult(String userId);



    PhysicalQuestionDto getPhysicalQuestion(PhysicalQuestionRequestDto requestDto, String userId);

    PhysicalResultDto getPhysicalCheckResult(String userId);

    Page<MedicalCheckResultDto> getResultList(Pageable pageable, LocalDate createDate, Type type);
}
