package com.kh.sowm.service;

import com.kh.sowm.dto.ProfileImageDto;
import com.kh.sowm.dto.UserDto;
import com.kh.sowm.dto.UserDto.RequestDto;
import com.kh.sowm.entity.*;
import com.kh.sowm.enums.CommonEnums;
import com.kh.sowm.enums.CommonEnums.Status;
import com.kh.sowm.repository.DepartmentRepository;
import com.kh.sowm.repository.JobRepository;
import com.kh.sowm.repository.ProfileImgRepository;
import com.kh.sowm.repository.UserRepository;
import com.kh.sowm.repository.VacationRepository;
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
    private final VacationRepository vacationRepository;

    @Override
    public User login(String userId, String userPwd) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("아이디를 찾을 수 없습니다."));
        if (!user.getUserPwd().equals(userPwd)) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        return user;
    }

    @Override
    public UserDto.ResponseDto getUserByUserId(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("아이디를 찾을 수 없습니다."));

        if (user.getStatus() == CommonEnums.Status.N) {
            throw new IllegalArgumentException("회원가입 승인 대기중입니다. 관리자에게 문의하세요.");
        } else if (user.getStatus() == CommonEnums.Status.D) {
            throw new IllegalArgumentException("탈퇴한 회원입니다.");
        }

        return UserDto.ResponseDto.getLoginUserDto(user);
    }

    @Override
    public String signUp(UserDto.RequestDto signUp) {

        User user = signUp.signUp();

        Company company = userRepository.findByCompanyCode(signUp.getCompanyCode())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회사코드입니다."));

        userRepository.save(user);
        return user.getUserId();
    }

    @Override
    public String adminSignUp(UserDto.RequestDto signUp) {

        User user = signUp.adminSignUp(Status.Y);

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

        // 관리자 직급 변경 시 로직 추가
        if ("J2".equals(user.getJob().getJobCode()) && !requestDto.getJobCode().equals("J2")) {
            long adminCount = userRepository.countByJobCode("J2");
            if (adminCount <= 1) {
                throw new IllegalStateException("최소 한 명의 관리자는 유지해야 합니다.");
            }
        }

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
            oldImg.deactivate();
            profileImgRepository.save(oldImg);
        }

        String changedName = dto.getChangedName();
        if (changedName == null || changedName.trim().isEmpty()) {
            String imgUrl = dto.getImgUrl();
            if (imgUrl != null && imgUrl.contains("/")) {
                changedName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1);
            } else {
                changedName = "unknown_filename";
            }
        }

        String oldName = dto.getOriginalName();
        if (oldName == null || oldName.trim().isEmpty()) {
            oldName = changedName;
        }

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

    @Override
    @Transactional
    public void convertPointsToVacation(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (user.getPoint() == null || user.getPoint() < 1500) {
            throw new IllegalArgumentException("포인트가 부족합니다.");
        }

        user.deductPoints(1500);
        user.addVacation(1); // 보유 휴가 수 1 증가
        userRepository.save(user);

        Vacation vacation = Vacation.builder()
                .user(user)
                .reason("포인트 전환")
                .build();
        vacationRepository.save(vacation);
    }

    @Override
    @Transactional(readOnly = true)
    public long getVacationCount(String userId) {
        return vacationRepository.countByUserId(userId);
    }
}