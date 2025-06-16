package com.kh.sowm.controller;

import com.kh.sowm.dto.UserDto;
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

    @PostMapping("/login")
    public ResponseEntity<UserDto.ResponseDto> login(@RequestBody UserDto.ResponseDto loginDto) {
        System.out.println("로그인 호출 : " + loginDto.getUserId() + "비밀번호 : " +  loginDto.getUserPwd());
        UserDto.ResponseDto loginUser = userService.login(loginDto.getUserId(), loginDto.getUserPwd());

        return ResponseEntity.ok(loginUser);
    }

}
