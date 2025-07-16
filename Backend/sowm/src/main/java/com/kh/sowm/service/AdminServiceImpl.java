package com.kh.sowm.service;

import com.kh.sowm.dto.AttendanceDto;
import com.kh.sowm.dto.AttendanceDto.WeeklyAttendanceDto;
import com.kh.sowm.dto.PageResponse;
import com.kh.sowm.dto.UserDto.DeleteUsersRequest;
import com.kh.sowm.dto.UserDto.RequestDto;
import com.kh.sowm.dto.UserDto.ResponseDto;
import com.kh.sowm.entity.Attendance;
import com.kh.sowm.entity.User;
import com.kh.sowm.repository.AttendanceRepository;
import com.kh.sowm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;

    // 회사별 근태 정보 페이징 처리로 가져오는 메소드
    @Override
    public PageResponse<AttendanceDto.Record> getAllAttendanceByCompany(String userId, Pageable pageable) {

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 정보가 존재하지 않습니다."));

        // 회사코드
        String companyCode = user.getCompany().getCompanyCode();
        Page<Attendance> page = attendanceRepository.findByCompanyCode(companyCode, pageable);
        Page<AttendanceDto.Record> dtoPage = page.map(AttendanceDto.Record::pageDto);

        return new PageResponse<>(dtoPage);
    }

    // 회사별 금일 출퇴근 정보 가져오는 메소드
    @Override
    public List<AttendanceDto.Record> getTodayAttendance(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 정보가 존재하지 않습니다."));

        // 회사코드
        String companyCode = user.getCompany().getCompanyCode();

        return attendanceRepository.getTodayAttendance(companyCode);
    }

    // 근태정보 수정하는 메소드
    @Override
    public AttendanceDto.Record updateAttendance(AttendanceDto.UpdateRequest request) {

        Attendance attendance = attendanceRepository.findById(request.getAttendanceNo())
                .orElseThrow(() -> new IllegalArgumentException("출퇴근 기록 없음"));

        // 출퇴근 시간 업데이트
        attendance.updateAttendance(request.getAttendTime(), request.getLeaveTime());

        // 근무 시간 계산 및 설정
        // Duration 은 시간 간격을 나타내는 클래스
        // LocalDateTime 같은 시점 간 차이를 계산할 때 사용함
        if (attendance.getAttendTime() != null && attendance.getLeaveTime() != null) {
            Duration duration = Duration.between(attendance.getAttendTime(), attendance.getLeaveTime());
            double hours = duration.toMinutes() / 60.0;
            attendance.setWorkHours(hours);
        } else {
            attendance.setWorkHours(0.0);
        }
        return AttendanceDto.Record.toDto(attendance);
    }

    // 전체 회원 근태 정보 가져오는 메소드 페이징 처리
    @Override
    public PageResponse<AttendanceDto.Record> getAttendances(String companyCode, String userName, String deptName, LocalDate date, Pageable pageable) {

        // 1. 조건으로 페이징 된 Attendance 리스트 가져오기
        Page<Attendance> attendances = attendanceRepository.findByFilter(companyCode, userName, deptName, date, pageable);

        // 2. Attendance 는 엔티티이므로 AttendanceDto.Record DTO로 변환
        Page<AttendanceDto.Record> dtoPage = attendances.map(AttendanceDto.Record::pageDto);

        // 3. Page → PageResponse 로 감싸서 반환
        return new PageResponse<>(dtoPage);
    }

    // 주간별 근태관리 가져오는 메소드
    @Override
    public ResponseEntity<List<AttendanceDto.WeeklyAttendanceDto>> getWeeklyAttendance(String companyCode) {
        List<AttendanceDto.WeeklyAttendanceDto> weeklyData = attendanceRepository.findWeeklyAttendanceSummary(companyCode);
        return ResponseEntity.ok(weeklyData);
    }

    // 계정 삭제 메소드
    @Override
    public ResponseEntity<?> deleteUserAccount(List<String> userIds) {
        for (String userId : userIds) {
            userRepository.findByUserId(userId).ifPresent(user -> {
                userRepository.deleteUser(user);  // 실제 삭제 또는 상태 변경 처리
            });
            // 없으면 그냥 무시
        }
        return ResponseEntity.ok().build();
    }



}
