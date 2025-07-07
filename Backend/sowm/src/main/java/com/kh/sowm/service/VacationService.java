package com.kh.sowm.service;

import com.kh.sowm.dto.VacationDto.VacationNoDto;
import com.kh.sowm.dto.VacationDto.VacationResponseDto;
import com.kh.sowm.dto.VacationDto.VacationSubmitDto;
import com.kh.sowm.dto.VacationDto.VacationWaitDto;
import com.kh.sowm.dto.WorkationDto.WorkationSubNoDto;
import com.kh.sowm.entity.Vacation;
import com.kh.sowm.entity.VacationAdmin;
import java.util.List;

public interface VacationService {
    List<Long> vacationDelete(VacationNoDto vacationNos);

    VacationSubmitDto submit(VacationSubmitDto request);

    List<VacationResponseDto> listGet(String userId);

    List<VacationWaitDto> waitListGet(String userId);
}
