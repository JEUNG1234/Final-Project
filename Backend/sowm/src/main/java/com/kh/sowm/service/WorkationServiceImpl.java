package com.kh.sowm.service;


import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.dto.WorkationDto.ResponseDto;
import com.kh.sowm.dto.WorkationDto.WorkationSubListDto;
import com.kh.sowm.dto.WorkationDto.WorkationSubNoDto;
import com.kh.sowm.dto.WorkationDto.WorkationUpdateDto;
import com.kh.sowm.entity.DayOff;
import com.kh.sowm.entity.SubmitWorkation;
import com.kh.sowm.entity.User;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationImage;
import com.kh.sowm.entity.WorkationImage.Tab;
import com.kh.sowm.entity.WorkationLocation;
import com.kh.sowm.enums.CommonEnums;
import com.kh.sowm.repository.DayOffRepository;
import com.kh.sowm.repository.SubmitWorkationRepository;
import com.kh.sowm.repository.UserRepository;
import com.kh.sowm.repository.WorkationImageRepository;
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
    private final WorkationImageRepository workationImageRepository;
    private final DayOffRepository dayOffRepository;
    private final SubmitWorkationRepository submitWorkationRepository;

    //워케이션 리스트 조회용
    @Override
    public ResponseEntity<List<WorkationDto.WorkationBasicDto>> workationList(String companyCode) {
        List<Workation> workations = workationRepository.findByStatus(CommonEnums.Status.Y, companyCode);

        List<WorkationDto.WorkationBasicDto> dtoList = workations.stream()
                .map(w -> {
                    String placeImage = w.getWorkationImages().stream()
                            .filter(img -> img.getTab() == WorkationImage.Tab.PLACE)
                            .map(WorkationImage::getChangedName)
                            .findFirst()
                            .orElse(null);

                    return new WorkationDto.WorkationBasicDto(
                            w.getWorkationLocation().getLocationNo(),
                            w.getWorkationLocation().getAddress(),
                            w.getWorkationTitle(),
                            w.getUser().getUserId(),
                            w.getPeopleMin(),
                            w.getPeopleMax(),
                            w.getWorkationStartDate(),
                            w.getWorkationEndDate(),
                            placeImage
                    );
                })
                .toList();

        return ResponseEntity.ok(dtoList);
    }

     //워케이션 생성
    @Override
    public WorkationDto.ResponseDto enrollWorkation(WorkationDto.WorkationCreateDto request) {
        String userId = request.getUserId();

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("회원아이디를 찾을 수 없습니다."));

        Workation workation = request.toWorkationEntity(user);
        WorkationLocation location = request.toLocationEntity();

        WorkationLocation savedLocation = workationLocationRepository.save(location);
        workation.setWorkationLocation(savedLocation);
        Workation savedWorkation = workationRepository.save(workation);
        if (request.getSelectedDays() != null) {
            for (String day : request.getSelectedDays()) {
                DayOff dayOff = DayOff.builder()
                        .dayOff(day)
                        .workation(savedWorkation)
                        .build();
                dayOffRepository.save(dayOff);
            }
        }

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            for (WorkationDto.WorkationImageDto imageDto : request.getImages()) {
                // (Entity 변환 과정 필요: WorkationImage entity 생성)
                WorkationImage image = WorkationImage.builder()
                        .workation(savedWorkation)
                        .originalName(imageDto.getOriginalName())
                        .changedName(imageDto.getChangedName())
                        .path(imageDto.getPath())
                        .size(imageDto.getSize())
                        .tab(Tab.valueOf(imageDto.getTab()))
                        .build();

                workationImageRepository.save(image);
                }
            }

            return WorkationDto.ResponseDto.toDto(savedWorkation);

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
    public ResponseDto updateWorkation(WorkationUpdateDto  request) {
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("회원아이디를 찾을 수 없습니다."));

        Workation workation = workationRepository.findByWorkationNo(request.getWorkationNo())
                .orElseThrow(() -> new EntityNotFoundException("워케이션 정보를 찾을 수 없습니다."));
        System.out.println(workation.getWorkationNo());

        workation.updateFromDto(request.getWorkation(), user);

        WorkationLocation location = workation.getWorkationLocation();
        location.updateFromDto(request.getLocation());

        Workation updateWorkation = workationRepository.updateWorkation(workation);
        workationLocationRepository.updateLocation(location);
        Long workationNo = request.getWorkationNo();

        dayOffRepository.deleteByworkationNo(workationNo);

        if (request.getSelectedDays() != null) {
            for (String day : request.getSelectedDays()) {
                DayOff dayOff = DayOff.builder()
                        .dayOff(day)
                        .workation(workation)
                        .build();
                dayOffRepository.updateDay(dayOff);
            }
        }

        workationImageRepository.deleteByworkationNo(workationNo);
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            for (WorkationDto.WorkationImageDto imageDto : request.getImages()) {
                WorkationImage image = WorkationImage.builder()
                        .workation(workation)
                        .originalName(imageDto.getOriginalName())
                        .changedName(imageDto.getChangedName())
                        .path(imageDto.getPath())
                        .size(imageDto.getSize())
                        .tab(Tab.valueOf(imageDto.getTab()))
                        .build();

                workationImageRepository.updateImage(image);
            }
        }

        return WorkationDto.ResponseDto.toDto(updateWorkation);
    }

    //워케이션 삭제용(상태값 변경)
    @Override
    public Workation delete(Long workationNo) {
        return workationRepository.updateWorkationStatus(workationNo);
    }

    //워케이션 신청 리스트 조회용
    @Override
    public ResponseEntity<List<WorkationSubListDto>> workationSubList(String companyCode) {
        List<SubmitWorkation> subWorkation = submitWorkationRepository.findByStatus(SubmitWorkation.StatusType.W, companyCode);

        List<WorkationSubListDto> dtoList = subWorkation.stream()
                .map(WorkationSubListDto::dto)
                .toList();

        return ResponseEntity.ok(dtoList);
    }

    //워케이션 신청 승인용
    @Override
    public List<Long> workationSubUpdate(WorkationSubNoDto selectedIds) {

        List<Long> workationSubNo = selectedIds.getWorkationSubNo();

        for(Long subNo : workationSubNo) {

            SubmitWorkation submit = submitWorkationRepository.findById(subNo)
                    .orElseThrow(() -> new EntityNotFoundException("해당 워케이션 신청 내역을 찾을 수 없습니다."+ subNo));
            submit.setStatus(SubmitWorkation.StatusType.Y);
            submitWorkationRepository.approvedUpdate(submit);
        }
        return workationSubNo;
    }

    //워케이션 신청 거절용
    @Override
    public List<Long> workationReturnUpdate(WorkationSubNoDto selectedIds) {
        List<Long> workationSubNo = selectedIds.getWorkationSubNo();
        for(Long subNo : workationSubNo) {
            SubmitWorkation submit = submitWorkationRepository.findById(subNo)
                    .orElseThrow(() -> new EntityNotFoundException("해당 워케이션 신청 내역을 찾을 수 없습니다."+ subNo));
            submit.setStatus(SubmitWorkation.StatusType.N);
            submitWorkationRepository.returnUpdate(submit);
        }
        return workationSubNo;
    }

    //워케이션 유저가 신청한 신철목록 리스트 가져오기
    @Override
    public ResponseEntity<List<WorkationSubListDto>> workationMySubList(String userId) {
        List<SubmitWorkation> submitWorkations = submitWorkationRepository.findById(userId);

        List<WorkationSubListDto> dtoList = submitWorkations.stream()
        .map(WorkationSubListDto::dto)
        .toList();

        return ResponseEntity.ok(dtoList);
    }

    //워케이션 신청취소용
    @Override
    public List<Long> workationMyDelete(WorkationSubNoDto selectedIds) {
        List<Long> WorkaionSubNo = selectedIds.getWorkationSubNo();
        for(Long subNo : WorkaionSubNo) {
            SubmitWorkation submit = submitWorkationRepository.findById(subNo)
                    .orElseThrow(() -> new EntityNotFoundException("해당 워케이션 신청 내역을 찾을 수 없습니다."+ subNo));
            submitWorkationRepository.delete(subNo);
        }
        return List.of();
    }

    //워케이션 전체 신청 내역 리스트 불러오기
    @Override
    public ResponseEntity<List<WorkationSubListDto>> workationFullSubList(String companyCode) {
        List<SubmitWorkation> subWorkation = submitWorkationRepository.findByList(companyCode);

        List<WorkationSubListDto> dtoList = subWorkation.stream()
                .map(WorkationSubListDto::dto)
                .toList();

        return ResponseEntity.ok(dtoList);
    }


}
