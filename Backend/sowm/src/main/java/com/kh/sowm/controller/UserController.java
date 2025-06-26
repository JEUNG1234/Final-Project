package com.kh.sowm.controller;

import com.kh.sowm.dto.UserDto;
import com.kh.sowm.entity.User;
import com.kh.sowm.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // 💡 포트 5174 -> 5173으로 수정
public class UserController {

    private final UserService userService;

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<UserDto.ResponseDto> login(@RequestBody UserDto.ResponseDto loginDto) {

        UserDto.ResponseDto loginUser = userService.login(loginDto.getUserId(), loginDto.getUserPwd());
        System.out.println("로그인 결과 ResponseDto: " +
                "userId=" + loginUser.getUserId() +
                ", userName=" + loginUser.getUserName() +
                ", companyCode=" + loginUser.getCompanyCode() +
                ", jobCode=" + loginUser.getJobCode() +
                ", deptCode=" + loginUser.getDeptCode());
        return ResponseEntity.ok(loginUser);
    }

    // 유저 아이디 기준으로 유저 정보 가져오기
    @GetMapping
    public ResponseEntity<UserDto.ResponseDto> getUserId(@RequestParam String userId) {
        UserDto.ResponseDto loginUser = userService.getUserByUserId(userId);

        return ResponseEntity.ok(loginUser);
    }

    // 직원 회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody UserDto.RequestDto signUpDto) {
        String result = userService.signUp(signUpDto);
        return ResponseEntity.ok(result);
    }

    // 아이디 중복 체크
    // 프론트에 중복 형태를 json 형태로 전달하기 위해
    // Map을 사용하여 {"isDuplicate": true/false} 구조로 응답함.
    // 단순 문자열(String)보다 key-value 형태가 의미 전달에 더 적절하다고 한다.
    @GetMapping("/check-user-id")
    public ResponseEntity<Map<String, Boolean>> checkUserId(@RequestParam String userId) {
        boolean isDuplicate = userService.isUserIdDuplicate(userId);

        Map<String, Boolean> response = new HashMap<>();
        response.put("isDuplicate", isDuplicate);

        return ResponseEntity.ok(response);
    }

    // 이메일 중복 체크
    // 프론트에 중복 형태를 json 형태로 명확히 전달하기 위해
    // Map을 사용하여 {"isDuplicate": true/false} 구조로 응답함.
    // 단순 문자열(String)보다 key-value 형태가 의미 전달에 더 적절하다고 한다.
    @GetMapping("/check-user-email")
    public ResponseEntity<Map<String, Boolean>> checkUserEmail(@RequestParam String email) {
        boolean isDuplicate = userService.isUserEmailDuplicate(email);

        Map<String, Boolean> response = new HashMap<>();
        response.put("isDuplicate", isDuplicate);

        return ResponseEntity.ok(response);
    }

    // 관리자 회원가입
    @PostMapping("/enrolladmin")
    public ResponseEntity<String> adminSignUp(@RequestBody UserDto.RequestDto signUpDto) {
        String result = userService.adminSignUp(signUpDto);
        return ResponseEntity.ok(result);
    }

}