package com.kh.sowm.controller;

import com.kh.sowm.dto.VacationAdminDto;
import com.kh.sowm.service.VacationAdminService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vacationadmin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class VacationAdminController {

    private final VacationAdminService vacationAdminService;

    // 휴가 승인 페이지
    @GetMapping("/getvactionlist")
    public ResponseEntity<List<VacationAdminDto.ResponseDto>> getVacationList(@RequestParam String companyCode) {
        return vacationAdminService.getVacationList(companyCode);
    }

    // 휴가 승인
    @PatchMapping("/updateVacationStatus")
    public ResponseEntity<List<Long>> updateVacationStatus(@RequestBody VacationAdminDto.RequestDto vacationNo) {
        List<Long> result = vacationAdminService.updateVacationStatus(vacationNo);
        return ResponseEntity.ok(result);
    }

    // 전체 휴가 제이터 가져오기
    @GetMapping("/getAllVacationList")
    public ResponseEntity<List<VacationAdminDto.ResponseDto>> getAllVacationList() {
        return vacationAdminService.getAllVactionList();
    }

    // 승인 거부
    @PatchMapping("/rejectVacation")
    public ResponseEntity<List<Long>> rejectVacation(@RequestBody VacationAdminDto.RequestDto vacation) {
        List<Long> result = vacationAdminService.rejectVacation(vacation);
        return ResponseEntity.ok(result);
    }
}
