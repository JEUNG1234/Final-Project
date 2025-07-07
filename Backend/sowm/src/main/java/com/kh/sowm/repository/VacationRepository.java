package com.kh.sowm.repository;

import com.kh.sowm.dto.VacationDto.VacationResponseDto;
import com.kh.sowm.entity.Vacation;
import com.kh.sowm.entity.VacationAdmin;
import com.kh.sowm.entity.VacationAdmin.StatusType;
import java.util.List;
import java.util.Optional;

public interface VacationRepository {
    void save(Vacation vacation);
    long countByUserId(String userId); // 추가된 메서드
    void save(VacationAdmin vacationAdmin);

    Optional<VacationResponseDto> findBylist(String userId, StatusType StatusType);

    List<VacationAdmin> findBySubmitList(String userId, StatusType StatusType);

    List<Vacation> findBySubmitList(String userId);
}