package com.kh.sowm.service;

import com.kh.sowm.dto.ProfileImageDto;
import com.kh.sowm.dto.UserDto;
import com.kh.sowm.dto.UserDto.RequestDto;
import com.kh.sowm.entity.User;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface UserService {
    User login(String userId, String userPwd);

    UserDto.ResponseDto getUserByUserId(String userId);

    String signUp(UserDto.RequestDto sigunUp);

    String adminSignUp(UserDto.RequestDto signUp);

    boolean isUserIdDuplicate(String userId);

    boolean isUserEmailDuplicate(String email);

    List<User> findEmployee(UserDto.EmployeeSearchCondition searchCondition);

    List<User> findNotApproval(UserDto.EmployeeSearchCondition searchCondition);

    UserDto.ResponseDto changeStatus(String userId, UserDto.RequestDto requestDto);

    UserDto.ResponseDto changeMemberStatus(String userId, UserDto.RequestDto requestDto);

    String deleteUser(String userId);

    String updateUserInfo(RequestDto updateDto, String userId);

    void uploadProfileImage(String userId, ProfileImageDto.Request dto);

    void convertPointsToVacation(String userId);

    long getVacationCount(String userId); // 추가된 메서드
}