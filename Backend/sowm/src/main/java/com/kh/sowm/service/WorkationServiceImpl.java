package com.kh.sowm.service;


import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.entity.SubmitWorkation;
import com.kh.sowm.entity.User;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;
import com.kh.sowm.enums.CommonEnums;
import com.kh.sowm.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final WorkationLocationRepository workationLocationRepository;

    //워케이션 리스트 조회용
    @Override
    public ResponseEntity<List<WorkationDto.WorkationBasicDto>> workationList(String companyCode) {
        List<Workation> workations = workationRepository.findByStatus(CommonEnums.Status.Y, companyCode);

        List<WorkationDto.WorkationBasicDto> dtoList = workations.stream()
                .map(w -> new WorkationDto.WorkationBasicDto(
                        w.getWorkationLocation().getLocationNo(),
                        w.getWorkationLocation().getAddress(),
                        w.getWorkationTitle(),
                        w.getUser().getUserId(),
                        w.getPeopleMin(),
                        w.getPeopleMax(),
                        w.getWorkationStartDate(),
                        w.getWorkationEndDate()
                ))
                .toList();

        return ResponseEntity.ok(dtoList);
    }

     //워케이션 생성
    @Override
    public WorkationDto.ResponseDto enrollWorkation(WorkationDto.WorkationCreateDto request) {
        String userId = request.getUserId();
        //유저 조회
        User user = userRepository.findByUserId(userId).orElseThrow(() ->new EntityNotFoundException("회원아이디를 찾을 수 없습니다."));
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

    //워케이션 정보 디테일
    @Override
    public WorkationDto.ResponseDto workationInfo(int locationNo) {
        return workationRepository.findByInfo(locationNo);
    }

    //워케이션 신청용
    @Override
    public WorkationDto.SubWorkation submit(WorkationDto.SubWorkation subWork) {
        User user = userRepository.findByUserId(subWork.getUserId())
                .orElseThrow(() -> new RuntimeException("유저를 조회할 수 없습니다."));

        Workation workation = workationRepository.findByWorkationNo(subWork.getWorkationNo())
                .orElseThrow(() -> new RuntimeException("워케이션 정보를 조회할 수 없습니다."));

        SubmitWorkation entity = subWork.subWorkationDto(user, workation);
        workationRepository.save(entity);

        return subWork;
    }


    //워케이션 수정용
    @Override
    public WorkationDto.ResponseUpdateDto updateWorkation(WorkationDto.WorkationUpdateDto  request) {
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("회원아이디를 찾을 수 없습니다."));

        Workation workation = workationRepository.findByWorkationNo(request.getWorkationNo())
                .orElseThrow(() -> new EntityNotFoundException("워케이션 정보를 찾을 수 없습니다."));

        workation.updateFromDto(request.getWorkation(), user);

        // 4. 워케이션로케이션 조회 및 수정
        WorkationLocation location = workation.getWorkationLocation();
        location.updateFromDto(request.getLocation());

        //merge
        workationRepository.updateWorkation(workation);
        workationLocationRepository.updateLocation(location);

        // 6. ResponseUpdateDto로 변환
        return WorkationDto.ResponseUpdateDto.toDto(workation);
    }

    @Override
    public Workation delete(Long workationNo) {
        return workationRepository.updateWorkationStatus(workationNo);
    }


}
