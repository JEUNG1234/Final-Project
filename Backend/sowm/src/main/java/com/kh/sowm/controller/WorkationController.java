package com.kh.sowm.controller;


import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;
import com.kh.sowm.repository.WorkationRepository;
import com.kh.sowm.service.WorkationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/workation")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class WorkationController {

    private final WorkationService workationService;


    @PostMapping("/create")
    public ResponseEntity<WorkationDto.ResponseDto> create(@RequestBody WorkationDto.WorkationCreateDto request) {

        String userId = request.getUserId();

        System.out.println(userId);

        Workation workation = request.toEntity();

        WorkationLocation location = request.toLocationEntity();

        Workation savedWorkation = workationService.enrollWorkation(workation, location, userId);
        System.out.println("저장완료");
        return null;
    }



}
