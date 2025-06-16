package com.kh.sowm.service;

import com.kh.sowm.dto.UserDto;

public interface UserService {
    UserDto.ResponseDto login(String userId, String userPwd);
}
