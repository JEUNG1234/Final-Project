package com.kh.sowm.controller;

import com.kh.sowm.dto.UserDto;
import com.kh.sowm.entity.User;
import com.kh.sowm.service.UserService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final UserService userService;

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


}
