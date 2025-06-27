package com.kh.sowm.service;

import com.kh.sowm.dto.MedicalCheckDto.MentalQuestionDto;
import com.kh.sowm.dto.MedicalCheckDto.MentalQuestionRequestDto;
import com.kh.sowm.dto.MedicalCheckDto.MentalResultDto;
import com.kh.sowm.dto.MedicalCheckDto.PhysicalQuestionDto;
import com.kh.sowm.dto.MedicalCheckDto.PhysicalQuestionRequestDto;
import com.kh.sowm.dto.MedicalCheckDto.PhysicalResultDto;

public interface HealthService {
    MentalQuestionDto getMentalQuestion(MentalQuestionRequestDto requestDto, String userId);

    MentalResultDto getMentalCheckResult(String userId);



    PhysicalQuestionDto getPhysicalQuestion(PhysicalQuestionRequestDto requestDto, String userId);

    PhysicalResultDto getPhysicalCheckResult(String userId);
}
