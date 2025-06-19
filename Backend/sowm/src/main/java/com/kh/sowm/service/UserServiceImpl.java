package com.kh.sowm.service;

import com.kh.sowm.dto.UserDto;
import com.kh.sowm.entity.Company;
import com.kh.sowm.entity.Department;
import com.kh.sowm.entity.Job;
import com.kh.sowm.entity.User;
import com.kh.sowm.enums.CommonEnums;
import com.kh.sowm.repository.DepartmentRepository;
import com.kh.sowm.repository.JobRepository;
import com.kh.sowm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public UserDto.ResponseDto login(String userId, String userPwd) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("아이디를 찾을 수 없습니다."));
        if (!user.getUserPwd().equals(userPwd)) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        return UserDto.ResponseDto.toDto(user);
    }

    // 아이디 유효성 검사
    @Override
    public UserDto.ResponseDto getUserByUserId(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("아이디를 찾을 수 없습니다."));
        return UserDto.ResponseDto.getLoginUserDto(user);
    }

    // 회원가입
    @Override
    public String signUp(UserDto.RequestDto signUp) {
        User user = signUp.signUp();
        userRepository.save(user);
        return user.getUserId();
    }

    // 관리자 회원가입
    @Override
    public String adminSignUp(UserDto.RequestDto signUp) {

        User user = signUp.adminSignUp();
        userRepository.save(user);
        return user.getUserId();
    }

    @Override
    public boolean isUserIdDuplicate(String userId) {
        return userRepository.existsByUserId(userId);
    }

    @Override
    public boolean isUserEmailDuplicate(String email) {
        return userRepository.existsByEmail(email);
    }


    @Override
    public List<User> findEmployee(UserDto.EmployeeSearchCondition searchCondition) {
        return userRepository.findAllEmployees(searchCondition);
    }

    @Override
    public List<User> findNotApproval(UserDto.EmployeeSearchCondition searchCondition) {
        return userRepository.findNotApproval(searchCondition);
    }

    @Override
    public UserDto.ResponseDto changeStatus(String userId, UserDto.RequestDto requestDto) {

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        Job job = jobRepository.findById(requestDto.getJobCode())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 직업 코드입니다."));

        user.updateStatus(CommonEnums.Status.valueOf(requestDto.getStatus()), job);
        System.out.println("업데이트 완료 후 잡코드: " + user.getJob().getJobCode());

        return UserDto.ResponseDto.toDto(user);
    }

    @Override
    public UserDto.ResponseDto changeMemberStatus(String userId, UserDto.RequestDto requestDto) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        Job job = jobRepository.findById(requestDto.getJobCode())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 직업 코드입니다."));
        user.changeJob(job);

        Department dept = departmentRepository.findById(requestDto.getDeptCode())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 부서 코드입니다."));
        user.changeDepartment(dept);

        userRepository.save(user);

        return UserDto.ResponseDto.toDto(user);
    }


}
