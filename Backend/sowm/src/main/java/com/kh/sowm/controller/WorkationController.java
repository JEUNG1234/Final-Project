package com.kh.sowm.controller;


import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.entity.User;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;
import com.kh.sowm.repository.WorkationRepository;
import com.kh.sowm.service.WorkationService;
import lombok.RequiredArgsConstructor;
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
        System.out.println("저장완료");
        return null;
    }

    //워케이션 리스트 조회
    @GetMapping("/list")
    public ResponseEntity<List<WorkationDto.WorkationBasicDto>> list(){

        System.out.println("workationService.workationList();"+workationService.workationList());
        return workationService.workationList();
    }




}
