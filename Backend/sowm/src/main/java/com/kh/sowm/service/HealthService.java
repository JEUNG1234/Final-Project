package com.kh.sowm.service;

import com.kh.sowm.dto.MedicalCheckDto.MentalQuestionDto;
import com.kh.sowm.dto.MedicalCheckDto.MentalQuestionRequestDto;
import com.kh.sowm.dto.MedicalCheckDto.MentalResultDto;

public interface HealthService {
    MentalQuestionDto getMentalQuestion(MentalQuestionRequestDto requestDto, String userId);

    MentalResultDto getMentalCheckResult(String userId);
}
