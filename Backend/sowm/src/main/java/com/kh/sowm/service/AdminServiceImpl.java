package com.kh.sowm.service;

import com.kh.sowm.dto.AttendanceDto;
import com.kh.sowm.dto.PageResponse;
import com.kh.sowm.entity.Attendance;
import com.kh.sowm.entity.User;
import com.kh.sowm.repository.AttendanceRepository;
import com.kh.sowm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Override
    public List<AttendanceDto.Record> getTodayAttendance(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 정보가 존재하지 않습니다."));

        // 회사코드
        String companyCode = user.getCompany().getCompanyCode();

        return attendanceRepository.getTodayAttendance(companyCode);
    }

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

    @Override
    public PageResponse<AttendanceDto.Record> getAttendances(String userName, String deptName, LocalDate date, Pageable pageable) {

        // 1. 조건으로 페이징 된 Attendance 리스트 가져오기
        Page<Attendance> attendances = attendanceRepository.findByFilter(userName, deptName, date, pageable);

        // 2. Attendance 는 엔티티이므로 AttendanceDto.Record DTO로 변환
        Page<AttendanceDto.Record> dtoPage = attendances.map(AttendanceDto.Record::pageDto);

        // 3. Page → PageResponse 로 감싸서 반환
        return new PageResponse<>(dtoPage);
    }

}
