package com.kh.sowm.controller;

import com.kh.sowm.dto.UserDto;
import com.kh.sowm.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserDto.ResponseDto> login(@RequestBody UserDto.ResponseDto loginDto) {
        UserDto.ResponseDto loginUser = userService.login(loginDto.getUserId());

        return ResponseEntity.ok(loginUser);
    }
}
