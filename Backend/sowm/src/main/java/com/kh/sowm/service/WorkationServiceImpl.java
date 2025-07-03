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
import com.kh.sowm.exception.usersException.UserNotFoundException;
import com.kh.sowm.exception.workationException.SubmitWorkationNotFoundException;
import com.kh.sowm.exception.workationException.WorkationEnrollException;
import com.kh.sowm.exception.workationException.WorkationNotFountException;
import com.kh.sowm.repository.DayOffRepository;
import com.kh.sowm.repository.SubmitWorkationRepository;
import com.kh.sowm.repository.UserRepository;
import com.kh.sowm.repository.WorkationImageRepository;
import com.kh.sowm.repository.WorkationLocationRepository;
import com.kh.sowm.repository.WorkationRepository;
import jakarta.persistence.NoResultException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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
    @Transactional
    public WorkationDto.ResponseDto enrollWorkation(WorkationDto.WorkationCreateDto request) {
        String userId = request.getUserId();

        User user = userRepository.findByUserId(userId)
                .orElseThrow(UserNotFoundException::new);

        Workation workation = request.toWorkationEntity(user);
        WorkationLocation location = request.toLocationEntity();

        WorkationLocation savedLocation;
        try {
            savedLocation = workationLocationRepository.save(location);
        }catch (DataIntegrityViolationException e) {
            throw new WorkationEnrollException("워케이션 장소 저장에 실패했습니다.");
        }

        workation.setWorkationLocation(savedLocation);
        Workation savedWorkation;
        try {
            savedWorkation = workationRepository.save(workation);
        } catch (DataIntegrityViolationException e) {
            throw new WorkationEnrollException("워케이션 저장에 실패했습니다.");
        }

        if (request.getSelectedDays() != null) {
            for (String day : request.getSelectedDays()) {
                DayOff dayOff = DayOff.builder()
                        .dayOff(day)
                        .workation(savedWorkation)
                        .build();
                try {
                    dayOffRepository.save(dayOff);
                } catch (DataIntegrityViolationException e) {
                    throw new WorkationEnrollException("휴무일 저장에 실패했습니다.");
                }
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

                try {
                    workationImageRepository.save(image);
                } catch (DataIntegrityViolationException e) {
                    throw new WorkationEnrollException("이미지 저장에 실패했습니다.");
                }


            }
        }

        return WorkationDto.ResponseDto.toDto(savedWorkation);

    }

    //워케이션 정보 디테일
    @Override
    public WorkationDto.ResponseDto workationInfo(int locationNo) {

        try {
            return workationRepository.findByInfo(locationNo);
        } catch (EmptyResultDataAccessException e) {
            throw new WorkationNotFountException();
        }

    }

    //워케이션 신청용
    @Override
    public WorkationDto.SubWorkation submit(WorkationDto.SubWorkation subWork) {
        User user = userRepository.findByUserId(subWork.getUserId())
                .orElseThrow(UserNotFoundException::new);

        Workation workation = workationRepository.findByWorkationNo(subWork.getWorkationNo())
                .orElseThrow(WorkationNotFountException::new);

        SubmitWorkation entity = subWork.subWorkationDto(user, workation);
        workationRepository.save(entity);

        return subWork;
    }

    //워케이션 수정용
    @Override
    @Transactional
    public ResponseDto updateWorkation(WorkationUpdateDto  request) {
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(UserNotFoundException::new);

        Workation workation = workationRepository.findByWorkationNo(request.getWorkationNo())
                .orElseThrow(() -> new WorkationNotFountException("워케이션 정보를 찾을 수 없습니다."));
        System.out.println(workation.getWorkationNo());

        workation.updateFromDto(request.getWorkation(), user);

        WorkationLocation location = workation.getWorkationLocation();
        location.updateFromDto(request.getLocation());

        Workation updateWorkation;
        try {
            updateWorkation = workationRepository.updateWorkation(workation);
        } catch (DataIntegrityViolationException e) {
            throw new WorkationEnrollException("워케이션 수정에 실패했습니다.");
        }
        try {
            workationLocationRepository.updateLocation(location);
        } catch (DataIntegrityViolationException e) {
            throw new WorkationEnrollException("워케이션 장소 수정에 실패했습니다.");
        }
        Long workationNo = request.getWorkationNo();

        try {
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
        } catch (DataIntegrityViolationException e) {
            throw new WorkationEnrollException("휴무일 수정에 실패했습니다.");
        }

        try {
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
        } catch (DataIntegrityViolationException e) {
            throw new WorkationEnrollException("이미지 수정에 실패했습니다.");
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

        if (subWorkation == null || subWorkation.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

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
                    .orElseThrow(() -> new SubmitWorkationNotFoundException("해당 워케이션 신청 내역을 찾을 수 없습니다."+ subNo));
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
                    .orElseThrow(() -> new SubmitWorkationNotFoundException("해당 워케이션 신청 내역을 찾을 수 없습니다."+ subNo));
            submit.setStatus(SubmitWorkation.StatusType.N);
            submitWorkationRepository.returnUpdate(submit);
        }
        return workationSubNo;
    }

    //워케이션 유저가 신청한 신철목록 리스트 가져오기
    @Override
    public ResponseEntity<List<WorkationSubListDto>> workationMySubList(String userId) {
        List<SubmitWorkation> submitWorkations = submitWorkationRepository.findById(userId);
        if (submitWorkations == null || submitWorkations.isEmpty()) {
            throw new SubmitWorkationNotFoundException("신청내역이 없습니다.");
        }

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
                    .orElseThrow(() -> new SubmitWorkationNotFoundException("해당 워케이션 신청 내역을 찾을 수 없습니다."+ subNo));
            submitWorkationRepository.delete(subNo);
        }
        return List.of();
    }

    //워케이션 전체 신청 내역 리스트 불러오기
    @Override
    public ResponseEntity<List<WorkationSubListDto>> workationFullSubList(String companyCode) {
        List<SubmitWorkation> subWorkation = submitWorkationRepository.findByList(companyCode);
        if (subWorkation == null || subWorkation.isEmpty()) {
            throw new SubmitWorkationNotFoundException("신청내역이 없습니다.");
        }

        List<WorkationSubListDto> dtoList = subWorkation.stream()
                .map(WorkationSubListDto::dto)
                .toList();

        return ResponseEntity.ok(dtoList);
    }

    @Override
    public ResponseEntity<List<WorkationSubListDto>> getApprovedWorkations(String userId) {
        List<SubmitWorkation> approvedWorkations = submitWorkationRepository.findApprovedByUserId(userId);

        List<WorkationSubListDto> dtoList = approvedWorkations.stream()
                .map(WorkationSubListDto::dto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }


}