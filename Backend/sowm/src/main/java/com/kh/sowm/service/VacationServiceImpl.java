package com.kh.sowm.service;


import com.kh.sowm.dto.VacationDto.VacationResponseDto;
import com.kh.sowm.dto.VacationDto.VacationSubmitDto;
import com.kh.sowm.entity.User;
import com.kh.sowm.entity.Vacation;
import com.kh.sowm.entity.VacationAdmin;
import com.kh.sowm.entity.VacationAdmin.StatusType;
import com.kh.sowm.enums.CommonEnums;
import com.kh.sowm.exception.usersException.UserNotFoundException;
import com.kh.sowm.repository.UserRepository;
import com.kh.sowm.repository.VacationRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class VacationServiceImpl implements VacationService{
    private final UserRepository userRepository;

    private final VacationRepository vacationRepository;

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

        System.out.println("1111111"+ vacationList);
        List<Vacation> vacationpointList = vacationRepository.findBySubmitList(userId);
        System.out.println("22222222"+ vacationpointList);
        List<VacationResponseDto> dtoList = vacationList.stream().map(VacationResponseDto::new).toList();
        System.out.println("33333333"+ dtoList);
        List<VacationResponseDto> vaList = vacationpointList.stream().map(VacationResponseDto::new).toList();
        System.out.println("44444444"+ vaList);
        List<VacationResponseDto> resultList = new ArrayList<>();
        resultList.addAll(dtoList);
        resultList.addAll(vaList);



        return resultList;
    }
}
