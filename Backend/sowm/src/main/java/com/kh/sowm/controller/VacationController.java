package com.kh.sowm.controller;


import com.kh.sowm.dto.VacationDto;
import com.kh.sowm.dto.VacationDto.VacationResponseDto;
import com.kh.sowm.dto.VacationDto.VacationSubmitDto;
import com.kh.sowm.entity.Vacation;
import com.kh.sowm.service.VacationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
    @PostMapping("/submit")
    public ResponseEntity<VacationDto.VacationSubmitDto> submit(@RequestBody VacationSubmitDto request) {

        VacationDto.VacationSubmitDto submitDto = vacationService.submit(request);

        return ResponseEntity.ok(submitDto);
    }

    @GetMapping("/list")
    public ResponseEntity<List<VacationResponseDto>> list(@RequestParam String userId) {

        System.out.println("여기까지옴 :::::::::::"+ userId);
        List<VacationResponseDto> dtoList = vacationService.listGet(userId);
        System.out.println(dtoList);
        return ResponseEntity.ok(dtoList);
    }
}
