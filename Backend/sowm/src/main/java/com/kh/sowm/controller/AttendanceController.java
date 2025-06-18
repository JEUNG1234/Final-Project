package com.kh.sowm.controller;

import com.kh.sowm.dto.AttendanceDto;
import com.kh.sowm.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AttendanceController {

    private final AttendanceService attendanceService;

    // 출근
    @PostMapping("/clock-in")
    public ResponseEntity<String> countClockIn(@RequestBody AttendanceDto.UserIdRequest UserIdRequest) {
        String userId = UserIdRequest.getUserId();
        String result = attendanceService.clockIn(userId);
        return ResponseEntity.ok(result);
    }

    // 퇴근
    // 퇴근 시간만 업데이트하는것이므로 put 으로
    @PutMapping("/clock-out")
    public ResponseEntity<String> countClockOut(@RequestBody AttendanceDto.UserIdRequest UserIdRequest) {
        String userId = UserIdRequest.getUserId();
        String result = attendanceService.clockOut(userId);
        return ResponseEntity.ok(result);
    }


    // 출근 상태 확인
    @GetMapping("/status/{userId}")
    public ResponseEntity<String> getAttendanceStatus(@PathVariable("userId") String userId) {
        String status = attendanceService.getTodayAttendanceStatus(userId);
        return ResponseEntity.ok(status);
    }



}
