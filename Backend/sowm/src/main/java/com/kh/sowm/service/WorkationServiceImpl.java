package com.kh.sowm.service;


import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.entity.User;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;
import com.kh.sowm.enums.CommonEnums;
import com.kh.sowm.repository.UserRepositoryImpl;
import com.kh.sowm.repository.WorkationLocationRepository;
import com.kh.sowm.repository.WorkationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkationServiceImpl implements WorkationService {

    private final WorkationRepository workationRepository;
    private final UserRepositoryImpl userRepositoryImpl;
    private final WorkationLocationRepository workationLocationRepository;

    //워케이션 리스트 조회용
    @Override
    public ResponseEntity<List<WorkationDto.WorkationBasicDto>> workationList() {
        List<Workation> workations = workationRepository.findByStatus(CommonEnums.Status.Y);

        List<WorkationDto.WorkationBasicDto> dtoList = workations.stream()
                .map(w -> new WorkationDto.WorkationBasicDto(
                        w.getWorkationLocation().getLocationNo(),
                        w.getWorkationLocation().getAddress(),
                        w.getWorkationTitle()
                ))
                .toList();

        return ResponseEntity.ok(dtoList);
    }

     //워케이션 생성
    @Override
    public WorkationDto.ResponseDto enrollWorkation(WorkationDto.WorkationCreateDto request) {
        String userId = request.getUserId();
        //유저 조회
        User user = userRepositoryImpl.findByUserId(userId).orElseThrow(() ->new EntityNotFoundException("회원아이디를 찾을 수 없습니다."));
        System.out.println(userId);

        //DTO -> Entity로 변환
        Workation workation = request.toWorkationEntity(user);
        WorkationLocation location = request.toLocationEntity();

        WorkationLocation savedLocation = workationLocationRepository.save(location);
        workation.setWorkationLocation(savedLocation);
        workationRepository.save(workation);
        workationLocationRepository.save(location);

        return WorkationDto.ResponseDto.toDto(workation);
    }

    @Override
    public WorkationDto.ResponseDto workationInfo(int locationNo) {
        return workationRepository.findByInfo(locationNo);
    }


}
