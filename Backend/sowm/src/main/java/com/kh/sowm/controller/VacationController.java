package com.kh.sowm.controller;


import com.kh.sowm.dto.VacationDto;
import com.kh.sowm.dto.VacationDto.VacationNoDto;
import com.kh.sowm.dto.VacationDto.VacationResponseDto;
import com.kh.sowm.dto.VacationDto.VacationSubmitDto;
import com.kh.sowm.dto.VacationDto.VacationWaitDto;
import com.kh.sowm.service.VacationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vacation")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") //
public class VacationController {

    private final VacationService vacationService;
    //휴가 신청
    @PostMapping("/submit")
    public ResponseEntity<VacationDto.VacationSubmitDto> submit(@RequestBody VacationSubmitDto request) {
        VacationDto.VacationSubmitDto submitDto = vacationService.submit(request);

        return ResponseEntity.ok(submitDto);
    }

    //휴가 내역리스트 가져오기
    @GetMapping("/list")
    public ResponseEntity<List<VacationResponseDto>> list(@RequestParam String userId) {

        List<VacationResponseDto> dtoList = vacationService.listGet(userId);

        return ResponseEntity.ok(dtoList);
    }

    //휴가 신청 리스트 가져오기
    @GetMapping("/waitList")
    public ResponseEntity<List<VacationWaitDto>> waitList(@RequestParam String userId) {

        List<VacationWaitDto> dtoList = vacationService.waitListGet(userId);

        return ResponseEntity.ok(dtoList);
    }

    //휴가 신청 취소
    @DeleteMapping("/delete")
    public ResponseEntity<List<Long>> delete(@RequestBody VacationNoDto vacationNos) {
        List <Long> result = vacationService.vacationDelete(vacationNos);

        return ResponseEntity.ok(result);
    }

}
