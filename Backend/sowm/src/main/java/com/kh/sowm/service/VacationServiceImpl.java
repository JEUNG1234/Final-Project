package com.kh.sowm.service;


import com.kh.sowm.dto.VacationDto.VacationNoDto;
import com.kh.sowm.dto.VacationDto.VacationResponseDto;
import com.kh.sowm.dto.VacationDto.VacationSubmitDto;
import com.kh.sowm.dto.VacationDto.VacationWaitDto;
import com.kh.sowm.entity.User;
import com.kh.sowm.entity.Vacation;
import com.kh.sowm.entity.VacationAdmin;
import com.kh.sowm.entity.VacationAdmin.StatusType;
import com.kh.sowm.exception.usersException.UserNotFoundException;
import com.kh.sowm.repository.UserRepository;
import com.kh.sowm.repository.VacationRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class VacationServiceImpl implements VacationService{
    private final UserRepository userRepository;

    private final VacationRepository vacationRepository;

    @Override
    public List<Long> vacationDelete(VacationNoDto vacationNos) {
        System.out.println("33333333333333333333333");
        List<Long> selectedIds = vacationNos.getVacationNos();
        System.out.println("4444444444444444444444444444");
        for(Long selectedId : selectedIds){
            VacationAdmin vacation = vacationRepository.findById(selectedId)
                    .orElseThrow(() -> new EntityNotFoundException("신청 내역을 찾을 수 없습니다."));
            vacationRepository.delete(selectedId);
            System.out.println("55555555555555555555555555");

        }
        System.out.println("666666666666666666666666666666");
        return List.of();
    }

    //휴가 신청
    @Override
    public VacationSubmitDto submit(VacationSubmitDto request) {
        User user = userRepository.findByUserId(request.getUserId()).orElseThrow(UserNotFoundException::new);

        VacationAdmin vacationAdmin = VacationAdmin.builder()
                .user(user)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .content(request.getContent())
                .amount(request.getAmount())
                .build();
        vacationRepository.save(vacationAdmin);

        return request;
    }

    //휴가 내역 가져오기
    @Override
    public List<VacationResponseDto> listGet(String userId) {


        List<VacationAdmin> vacationList = vacationRepository.findBySubmitList(userId, StatusType.Y);


        List<Vacation> vacationpointList = vacationRepository.findBySubmitList(userId);

        List<VacationResponseDto> dtoList = vacationList.stream().map(VacationResponseDto::new).toList();

        List<VacationResponseDto> vaList = vacationpointList.stream().map(VacationResponseDto::new).toList();

        List<VacationResponseDto> resultList = new ArrayList<>();
        resultList.addAll(dtoList);
        resultList.addAll(vaList);



        return resultList;
    }

    @Override
    public List<VacationWaitDto> waitListGet(String userId) {

        List<VacationAdmin> vacationList = vacationRepository.findByWaitList(userId);

        return vacationList.stream().map(VacationWaitDto::new).toList();


    }
}
