package com.kh.sowm.service;

import com.kh.sowm.dto.AttendanceDto;
import com.kh.sowm.entity.Attendance;
import com.kh.sowm.entity.User;
import com.kh.sowm.repository.AttendanceRepository;
import com.kh.sowm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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
    public List<AttendanceDto.Record> getAllAttendanceByCompany(String userId) {

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 정보가 존재하지 않습니다."));

        // 회사코드
        String companyCode = user.getCompany().getCompanyCode();

        return attendanceRepository.getAllAttendanceByCompany(companyCode);
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
        if (attendance.getAttendTime() != null && attendance.getLeaveTime() != null) {
            Duration duration = Duration.between(attendance.getAttendTime(), attendance.getLeaveTime());
            double hours = duration.toMinutes() / 60.0;
            attendance.setWorkHours(hours);
        } else {
            attendance.setWorkHours(0.0);
        }

        return AttendanceDto.Record.toDto(attendance);
    }

    // 조건으로 직원 출퇴근 정보 확인 , 개발중
//    @Override
//    public List<AttendanceDto.Record> getAttendances(String userName, String deptName, LocalDate date) {
//
//        List<Attendance> attendances = attendanceRepository.findByFilters(userName, deptName, date);
//        return attendances.stream()
//                .map(AttendanceDto.Record::toDto)
//                .collect(Collectors.toList());
//
//
//    }

}
