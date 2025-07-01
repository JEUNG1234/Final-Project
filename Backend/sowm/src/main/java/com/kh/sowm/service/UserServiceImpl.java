package com.kh.sowm.service;

import com.kh.sowm.dto.ProfileImageDto;
import com.kh.sowm.dto.UserDto;
import com.kh.sowm.dto.UserDto.RequestDto;
import com.kh.sowm.entity.Company;
import com.kh.sowm.entity.Department;
import com.kh.sowm.entity.Job;
import com.kh.sowm.entity.ProfileImage;
import com.kh.sowm.entity.User;
import com.kh.sowm.enums.CommonEnums;
import com.kh.sowm.enums.CommonEnums.Status;
import com.kh.sowm.repository.DepartmentRepository;
import com.kh.sowm.repository.JobRepository;
import com.kh.sowm.repository.ProfileImgRepository;
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
    private final ProfileImgRepository profileImgRepository;

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

        if (user.getStatus() == CommonEnums.Status.N) {
            throw new IllegalArgumentException("탈퇴한 회원입니다.");
        }

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

    @Override
    public String deleteUser(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(()-> new IllegalArgumentException("회원정보가 없습니다."));

        return userRepository.deleteUser(user);
    }

    @Override
    public String updateUserInfo(RequestDto updateDto, String userId) {
        System.out.println("입력 비밀번호: " + updateDto.getPassword());

        User user = userRepository.findByUserId(userId)
                .orElseThrow(()-> new IllegalArgumentException("회원정보가 없습니다."));
        System.out.println("DB 비밀번호: " + user.getUserPwd());

        // db 에 저장되어 있는 비밀번호랑 입력한 비밀번호가 동일한지 체크
        if (!user.getUserPwd().equals(updateDto.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }
        user.changeUserInfo(updateDto.getUserName(), updateDto.getNewPwd());

        return userRepository.updateUserInfo(user);
    }

    @Override
    public void uploadProfileImage(String userId, ProfileImageDto.Request dto) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보가 존재하지 않습니다."));

        ProfileImage oldImg = user.getOldImg();
        if (oldImg != null) {
            // 이미지가 존재하면 status 를 N 으로 바꿈 (기존 이미지 비활성화)
            oldImg.deactivate();
            profileImgRepository.save(oldImg);
        }

        // changedName 처리: null 또는 빈 문자열이면 imgUrl에서 파일명 추출
        String changedName = dto.getChangedName();
        if (changedName == null || changedName.trim().isEmpty()) {
            String imgUrl = dto.getImgUrl();
            if (imgUrl != null && imgUrl.contains("/")) {
                changedName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1);
            } else {
                changedName = "unknown_filename";
            }
        }

        // oldName 처리: null 또는 빈 문자열이면 changedName으로 기본값 설정
        String oldName = dto.getOriginalName();
        if (oldName == null || oldName.trim().isEmpty()) {
            oldName = changedName;
        }

        // 이미지가 존재하지 않는다면 새로운 이미지 파일 업로드
        // 새로운 이미지 생성
        ProfileImage newImg = ProfileImage.builder()
                .user(user)
                .originalName(oldName) 
                .changedName(changedName)
                .path(dto.getImgUrl())
                .size(dto.getSize())
                .status(Status.Y)
                .build();
        profileImgRepository.save(newImg);
        user.updateProfileImg(newImg);
        userRepository.save(user);
    }


}
