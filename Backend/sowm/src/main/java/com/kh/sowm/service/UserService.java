package com.kh.sowm.service;

import com.kh.sowm.dto.UserDto;
import com.kh.sowm.entity.User;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface UserService {
    UserDto.ResponseDto login(String userId, String userPwd);

    UserDto.ResponseDto getUserByUserId(String userId);

    String signUp(UserDto.RequestDto sigunUp);

    String adminSignUp(UserDto.RequestDto signUp);

    boolean isUserIdDuplicate(String userId);

    boolean isUserEmailDuplicate(String email);

    List<User> findEmployee(UserDto.EmployeeSearchCondition searchCondition);

    List<User> findNotApproval(UserDto.EmployeeSearchCondition searchCondition);

    UserDto.ResponseDto changeStatus(String userId, UserDto.RequestDto requestDto);
}
