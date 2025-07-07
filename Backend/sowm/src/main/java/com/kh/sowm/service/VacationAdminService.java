package com.kh.sowm.service;

import com.kh.sowm.dto.VacationAdminDto;
import com.kh.sowm.dto.VacationAdminDto.RequestDto;
import com.kh.sowm.dto.VacationAdminDto.ResponseDto;
import java.util.List;
import org.springframework.http.ResponseEntity;

public interface VacationAdminService {
    ResponseEntity<List<VacationAdminDto.ResponseDto>> getVacationList(String companyCode);

    List<Long> updateVacationStatus(RequestDto vacationNo);

    ResponseEntity<List<ResponseDto>> getAllVactionList();
}
