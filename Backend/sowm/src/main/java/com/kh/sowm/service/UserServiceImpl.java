package com.kh.sowm.service;

import com.kh.sowm.dto.UserDto;
import com.kh.sowm.entity.User;
import com.kh.sowm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDto.ResponseDto login(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("아이디를 찾을 수 없습니다."));
        return UserDto.ResponseDto.toDto(user);
    }

}
