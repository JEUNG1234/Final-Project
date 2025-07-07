package com.kh.sowm.controller;


import com.kh.sowm.dto.VacationDto;
import com.kh.sowm.dto.VacationDto.VacationNoDto;
import com.kh.sowm.dto.VacationDto.VacationResponseDto;
import com.kh.sowm.dto.VacationDto.VacationSubmitDto;
import com.kh.sowm.dto.VacationDto.VacationWaitDto;
import com.kh.sowm.dto.WorkationDto.WorkationSubNoDto;
import com.kh.sowm.entity.Vacation;
import com.kh.sowm.entity.VacationAdmin;
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
    @PostMapping("/submit")
    public ResponseEntity<VacationDto.VacationSubmitDto> submit(@RequestBody VacationSubmitDto request) {

        VacationDto.VacationSubmitDto submitDto = vacationService.submit(request);

        return ResponseEntity.ok(submitDto);
    }

    @GetMapping("/list")
    public ResponseEntity<List<VacationResponseDto>> list(@RequestParam String userId) {

        List<VacationResponseDto> dtoList = vacationService.listGet(userId);

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/waitList")
    public ResponseEntity<List<VacationWaitDto>> waitList(@RequestParam String userId) {

        List<VacationWaitDto> dtoList = vacationService.waitListGet(userId);

        return ResponseEntity.ok(dtoList);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<List<Long>> delete(@RequestBody VacationNoDto vacationNos) {
        System.out.println("11111111111111");

        List <Long> result = vacationService.vacationDelete(vacationNos);
        System.out.println("2222222222222222");
        return ResponseEntity.ok(result);

    }

}
