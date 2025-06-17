package com.kh.sowm.service;

import com.kh.sowm.dto.UserDto;
import com.kh.sowm.entity.Company;
import com.kh.sowm.entity.Job;
import com.kh.sowm.entity.User;
import com.kh.sowm.repository.JobRepository;
import com.kh.sowm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    @Override
    public UserDto.ResponseDto login(String userId, String userPwd) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("아이디를 찾을 수 없습니다."));
        return UserDto.ResponseDto.toDto(user);
    }

    @Override
    public UserDto.ResponseDto getUserByUserId(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("아이디를 찾을 수 없습니다."));
        return UserDto.ResponseDto.getLoginUserDto(user);
    }

    @Override
    public String signUp(UserDto.RequestDto signUp) {
        User user = signUp.signUp();
        userRepository.save(user);
        return user.getUserId();
    }

    @Override
    public String adminSignUp(UserDto.RequestDto signUp) {
        Job adminJob = jobRepository.findById("J2")
                .orElseThrow(() -> new RuntimeException("관리자 직급 코드 J2가 DB에 없습니다."));
        User user = signUp.adminSignUp();
        System.out.println("관리자 잡코드 : " + user.getJob().getJobCode());
        userRepository.save(user);
        return user.getUserId();
    }


}
