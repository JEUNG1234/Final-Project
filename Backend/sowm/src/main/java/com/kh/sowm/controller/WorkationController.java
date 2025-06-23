package com.kh.sowm.controller;

import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.service.WorkationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workation")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
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
    public ResponseEntity<WorkationDto.ResponseUpdateDto> update(@RequestBody WorkationDto.WorkationUpdateDto request) {
        WorkationDto.ResponseUpdateDto updated = workationService.updateWorkation(request);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
}
