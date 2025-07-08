package com.kh.sowm.service;

import com.kh.sowm.dto.VacationAdminDto;
import com.kh.sowm.dto.VacationAdminDto.RequestDto;
import com.kh.sowm.dto.VacationAdminDto.ResponseDto;
import com.kh.sowm.entity.User;
import com.kh.sowm.entity.VacationAdmin;
import com.kh.sowm.entity.VacationAdmin.StatusType;
import com.kh.sowm.repository.VacationAdminRepository;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class VacationAdminServiceImpl implements VacationAdminService {

    private final VacationAdminRepository vacationAdminRepository;

    // 휴가 승인 페이지
    @Override
    public ResponseEntity<List<ResponseDto>> getVacationList(String companyCode) {
        // 휴가 승인을 하기 위해 상태값 W 인 거 가져오기
        List<VacationAdmin> vacationList = vacationAdminRepository.findByStatus(StatusType.W, companyCode);
        
        List<ResponseDto> vacationAdminDtoList = vacationList.stream()
                .map(v -> ResponseDto.builder()
                        .vacationNo(v.getVacationNo())
                        .startDate(v.getStartDate())
                        .endDate(v.getEndDate())
                        .content(v.getContent())
                        .userName(v.getUser().getUserName())
                        .status(v.getStatus())
                        .build()
                ).toList();

        return ResponseEntity.ok(vacationAdminDtoList);
    }

    @Override
    public List<Long> updateVacationStatus(RequestDto vacationNo) {

        List<Long> vacationNos = vacationNo.getVacationNos();
        StatusType newStatus = vacationNo.getStatus();

        List<VacationAdmin> vacations = vacationAdminRepository.findAllById(vacationNos);

        for (VacationAdmin vacation : vacations) {
            vacation.changeStauts(newStatus);

            if (vacation.getStatus() == StatusType.Y) {

                long days = ChronoUnit.DAYS.between(vacation.getStartDate(), vacation.getEndDate()) + 1;
                User user = vacation.getUser();
                Integer remainVacation = user.getVacation();

                if (remainVacation < days) {
                    throw new IllegalArgumentException(user.getUserName() + "님의 남은 휴가일 수가 부족합니다.");
                }
                user.minusVacation((int)days);
            }
        }
        vacationAdminRepository.saveAll(vacations);

        return vacations.stream()
                .map(VacationAdmin::getVacationNo)
                .toList();
    }

    @Override
    public ResponseEntity<List<ResponseDto>> getAllVactionList(String companyCode) {
        return vacationAdminRepository.getAllVactionList(companyCode);
    }

    @Override
    public List<Long> rejectVacation(RequestDto vacation) {
        List<Long> vacationNos = vacation.getVacationNos();
        StatusType newStatus = vacation.getStatus();

        List<VacationAdmin> vacations = vacationAdminRepository.findAllById(vacationNos);

        for (VacationAdmin vacationList : vacations) {
            vacationList.changeStauts(newStatus);
        }
        vacationAdminRepository.saveAll(vacations);

        return vacations.stream()
                .map(VacationAdmin::getVacationNo)
                .toList();
    }
}
