package com.kh.sowm.service;

import com.kh.sowm.dto.VacationDto.VacationResponseDto;
import com.kh.sowm.dto.VacationDto.VacationSubmitDto;
import com.kh.sowm.entity.Vacation;
import java.util.List;

public interface VacationService {
    VacationSubmitDto submit(VacationSubmitDto request);

    List<VacationResponseDto> listGet(String userId);
}
