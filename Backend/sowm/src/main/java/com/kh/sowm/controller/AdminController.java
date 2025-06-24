package com.kh.sowm.controller;

import com.kh.sowm.dto.AttendanceDto;
import com.kh.sowm.dto.PageResponse;
import com.kh.sowm.dto.UserDto;
import com.kh.sowm.entity.User;
import com.kh.sowm.service.AdminService;
import com.kh.sowm.service.AttendanceService;
import com.kh.sowm.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final UserService userService;
    private final AdminService adminService;

    // 직원 정보 가져오는 메소드
    @GetMapping("/employeemanagement")
    public ResponseEntity<List<UserDto.ResponseDto>> getEmployeeManagement(UserDto.EmployeeSearchCondition searchCondition) {
        System.out.println("검색 조건: " + searchCondition); // DTO가 잘 바인딩되었는지 확인용

        List<User> users = userService.findEmployee(searchCondition);

        List<UserDto.ResponseDto> dtos = users.stream()
                .map(UserDto.ResponseDto::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // 직원 관리 페이지 - 직원 직급, 부서 수정
    @PatchMapping("/memberrole/{userId}")
    public ResponseEntity<UserDto.ResponseDto> changeMemberStatus(@PathVariable String userId, @RequestBody UserDto.RequestDto requestDto) {
        return ResponseEntity.ok(userService.changeMemberStatus(userId, requestDto));
    }


    // 미승인 계정 정보 가져오는 메소드
    @GetMapping("/employeeapproval")
    public ResponseEntity<List<UserDto.ResponseDto>> getEmployeeApproval(UserDto.EmployeeSearchCondition searchCondition) {

        List<User> users = userService.findNotApproval(searchCondition);

        List<UserDto.ResponseDto> dtos = users.stream()
                .map(UserDto.ResponseDto::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // 직원 승인 - 유저 아이디로 status 바꾸기 Y로
    @PatchMapping("/{userId}")
    public ResponseEntity<UserDto.ResponseDto> changeStatus(@PathVariable String userId, @RequestBody UserDto.RequestDto requestDto) {
        return ResponseEntity.ok(userService.changeStatus(userId, requestDto));
    }

    // 회사별 전체 출퇴근 기록 조회
    @GetMapping("/adminattendance")
    public ResponseEntity<PageResponse<AttendanceDto.Record>> getAllAttendance(@RequestParam String userId, Pageable pageable){
        PageResponse<AttendanceDto.Record> attendanceList = adminService.getAllAttendanceByCompany(userId, pageable);
        return ResponseEntity.ok((attendanceList));
    }

    // 당일 출퇴근 기록 조회
    @GetMapping("/adminattendance/today")
    public ResponseEntity<List<AttendanceDto.Record>> getTodayAttendance(@RequestParam String userId){

        List<AttendanceDto.Record> attendanceList = adminService.getTodayAttendance(userId);

        return ResponseEntity.ok(attendanceList);
    }

    // 출 퇴근 기록 수정
    @PatchMapping("/adminattendance")
    public ResponseEntity<AttendanceDto.Record> updateAttendance(@RequestBody AttendanceDto.UpdateRequest request) {
        AttendanceDto.Record updated = adminService.updateAttendance(request);
        return ResponseEntity.ok(updated);
    }

    // 조건으로 직원 출퇴근 정보 확인
    @GetMapping("/adminattendance/filter")
    public ResponseEntity<PageResponse<AttendanceDto.Record>> getMemberAttendance(
            @RequestParam(required = false) String userName,
            @RequestParam(required = false) String deptName,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Pageable pageable
    ) {
        PageResponse<AttendanceDto.Record> attendanceList = adminService.getAttendances(userName, deptName, date, pageable);
        return ResponseEntity.ok(attendanceList);
    }

}
