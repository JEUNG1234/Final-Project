package com.kh.sowm.controller;

import com.kh.sowm.dto.UserDto;
import com.kh.sowm.entity.User;
import com.kh.sowm.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<UserDto.ResponseDto> login(@RequestBody UserDto.ResponseDto loginDto) {
        System.out.println("로그인 호출 : " + loginDto.getUserId() + "비밀번호 : " +  loginDto.getUserPwd());
        UserDto.ResponseDto loginUser = userService.login(loginDto.getUserId(), loginDto.getUserPwd());

        return ResponseEntity.ok(loginUser);
    }

    // 유저 아이디 기준으로 유저 정보 가져오기
    @GetMapping
    public ResponseEntity<UserDto.ResponseDto> getUserId(@RequestParam String userId) {
        UserDto.ResponseDto loginUser = userService.getUserByUserId(userId);

        return ResponseEntity.ok(loginUser);
    }


}
