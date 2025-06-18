package com.kh.sowm.service;

import com.kh.sowm.entity.Attendance;
import com.kh.sowm.entity.User;
import com.kh.sowm.enums.CommonEnums;
import com.kh.sowm.repository.AttendanceRepository;
import com.kh.sowm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    
    // 출근
    @Override
    public String clockIn(String userId) {

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        LocalDateTime today = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime tomorrow = today.plusDays(1);

        boolean alreadyClockedIn = attendanceRepository.existsByUserAndAttendTimeBetween(
                user, today, tomorrow);

        if (alreadyClockedIn) {
            return "이미 출근했음";
        }

        Attendance attendance = Attendance.builder()
                .user(user)
                .attendTime(LocalDateTime.now())
                .status(CommonEnums.AttendanceStatus.W)
                .build();
        attendanceRepository.save(attendance);
        return "출근 완료";
    }

    @Override
    @Transactional
    public String clockOut(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        LocalDateTime todayStart = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime tomorrowStart = todayStart.plusDays(1);

        // 오늘 출근 상태인 출근 기록 중 가장 최신 것 조회
        Optional<Attendance> clockOut = attendanceRepository.findLastClockInRecord(
                user, todayStart, tomorrowStart, CommonEnums.AttendanceStatus.W);

        if (clockOut.isEmpty()) {
            return "출근 기록이 없어 퇴근할 수 없습니다.";
        }

        Attendance attendance = clockOut.get();

        // 이미 퇴근 상태라면 퇴근 불가 처리 (중복 퇴근 방지)
        if (attendance.getStatus() == CommonEnums.AttendanceStatus.L) {
            return "이미 퇴근했습니다.";
        }
        // 출근 기록에 퇴근 시간 및 상태 업데이트
        attendance.markClockOut();

        // 근무 시간 계산
        Duration duration = Duration.between(attendance.getAttendTime(), attendance.getLeaveTime());
        double hours = duration.toMinutes() / 60.0;
        attendance.setWorkHours(hours);

        // 변경 감지로 update 수행
        attendanceRepository.save(attendance);

        return "퇴근 완료";
    }


    @Override
    public String getTodayAttendanceStatus(String userId) {

        // 1. 유저 정보 찾아오기
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보가 없습니다."));

        // 2. 오늘 날짜의 시작과 끝 시간을 계산
        LocalDateTime todayStart = LocalDate.now().atStartOfDay(); // 오늘 00시 00분 00초
        LocalDateTime tomorrowStart = LocalDate.now().plusDays(1).atStartOfDay(); // 내일 00시 00분 00초

        List<Attendance> todatAttandanceList = attendanceRepository.findUserAttendanceStatus(user, todayStart, tomorrowStart);
        if (todatAttandanceList.isEmpty()) {
            return "NONE"; // 오늘 출근 기록이 없음
        } else {
            // 가장 최신 출근 기록을 가져옴
            Attendance latestAttendance = todatAttandanceList.get(0);

            if (latestAttendance.getStatus() == CommonEnums.AttendanceStatus.W) {
                return "W"; // 출근 상태 (근무 중)
            } else if (latestAttendance.getStatus() == CommonEnums.AttendanceStatus.L) {
                return "L"; // 퇴근 상태
            }
            return "NONE";
        }
    }


}
