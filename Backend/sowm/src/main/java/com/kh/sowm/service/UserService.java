package com.kh.sowm.service;

import com.kh.sowm.dto.UserDto;

public interface UserService {
    UserDto.ResponseDto login(String userId, String userPwd);

    UserDto.ResponseDto getUserByUserId(String userId);

    String signUp(UserDto.RequestDto sigunUp);

    String adminSignUp(UserDto.RequestDto signUp);
}
