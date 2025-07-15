package com.kh.sowm.controller;

import com.kh.sowm.dto.BoardDto.Response;
import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.dto.WorkationDto.ResponseDto;
import com.kh.sowm.dto.WorkationDto.WorkationNoDto;
import com.kh.sowm.dto.WorkationDto.WorkationSubListDto;
import com.kh.sowm.dto.WorkationDto.WorkationSubNoDto;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.service.WorkationService;
import java.util.ArrayList;
import lombok.RequiredArgsConstructor;
import org.hibernate.jdbc.Work;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workation")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") //
public class WorkationController {

    private final WorkationService workationService;

    //워케이션 생성
    @PostMapping("/create")
    public ResponseEntity<WorkationDto.ResponseDto> create(@RequestBody WorkationDto.WorkationCreateDto request) {
        WorkationDto.ResponseDto savedWorkation = workationService.enrollWorkation(request);

        return new ResponseEntity<>(savedWorkation, HttpStatus.CREATED);
    }

    //워케이션 리스트 조회
    @GetMapping("/list")
    public ResponseEntity<List<WorkationDto.WorkationBasicDto>> list(@RequestParam String companyCode) {

        return workationService.workationList(companyCode);
    }

    //워케이션 정보 조회
    @GetMapping("/info")
    public WorkationDto.ResponseDto info(@RequestParam int locationNo) {

        return workationService.workationInfo(locationNo);
    }

    //워케이션 신청
    @PostMapping("/submit")
    public WorkationDto.SubWorkation submit(@RequestBody WorkationDto.SubWorkation subWork) {

        return workationService.submit(subWork);
    }

    //워케이션 수정기능
    @PatchMapping("/update")
    public ResponseEntity<ResponseDto> update(@RequestBody WorkationDto.WorkationUpdateDto request) {
        ResponseDto updated = workationService.updateWorkation(request);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    //워케이션 삭제 기능
    @PatchMapping("/delete")
    public WorkationDto.ResponseDto delete(@RequestBody WorkationDto.WorkationNoDto workNo) {

        Long workationNo = workNo.getWorkationNo();
        Workation deleted = workationService.delete(workationNo);
        return WorkationDto.ResponseDto.toDto(deleted);
    }

    //워케이션 신청 리스트 조회
    @GetMapping("/sublist")
    public ResponseEntity<List<WorkationDto.WorkationSubListDto>> sublist(@RequestParam String companyCode) {
        return workationService.workationSubList(companyCode);
    }

    //워케이션 신청 승인용
    @PatchMapping("/subupdate")
    public ResponseEntity<List<Long>> subupdate(@RequestBody WorkationSubNoDto selectedIds) {
        List<Long> result = workationService.workationSubUpdate(selectedIds);
        return ResponseEntity.ok(result);
    }

    //워케이션 신청 거절용
    @PatchMapping("/returnupdate")
    public ResponseEntity<List<Long>> returnupdate(@RequestBody WorkationSubNoDto selectedIds) {

        List<Long> result = workationService.workationReturnUpdate(selectedIds);
        return ResponseEntity.ok(result);
    }

    //워케이션 유저 신청 리스트
    @GetMapping("/submylist")
    public ResponseEntity<List<WorkationDto.WorkationSubListDto>> submylist(@RequestParam String userId) {

        return workationService.workationMySubList(userId);
    }

    //워케이션 신청 취소
    @DeleteMapping("/mydelete")
    public ResponseEntity<List<Long>> mydelete(@RequestBody WorkationSubNoDto selectedIds) {


        List <Long> result = workationService.workationMyDelete(selectedIds);
        return ResponseEntity.ok(result);

    }

    //워케이션 전체 신청내역 리스트
    @GetMapping("/fullsublist")
    public ResponseEntity<List<WorkationDto.WorkationSubListDto>> fullsublist(@RequestParam String companyCode) {
        ResponseEntity<List<WorkationSubListDto>> result =workationService.workationFullSubList(companyCode);
        return result;
    }

    @GetMapping("/approved-list")
    public ResponseEntity<List<WorkationDto.WorkationSubListDto>> getApprovedWorkations(@RequestParam String userId) {
        return workationService.getApprovedWorkations(userId);
    }


}