package com.kh.sowm.repository;

import com.kh.sowm.dto.VacationAdminDto.ResponseDto;
import com.kh.sowm.entity.VacationAdmin;
import com.kh.sowm.entity.VacationAdmin.StatusType;
import java.util.List;
import org.springframework.http.ResponseEntity;

public interface VacationAdminRepository {
    List<VacationAdmin> findByStatus(StatusType statusType, String companyCode);

    List<VacationAdmin> findAllById(List<Long> vacationNos);

    void saveAll(List<VacationAdmin> vacations);

    ResponseEntity<List<ResponseDto>> getAllVactionList(String companyCode);
}
