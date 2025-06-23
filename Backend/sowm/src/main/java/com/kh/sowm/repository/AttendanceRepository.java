package com.kh.sowm.repository;

import com.kh.sowm.dto.AttendanceDto;
import com.kh.sowm.entity.Attendance;
import com.kh.sowm.entity.User;
import com.kh.sowm.enums.CommonEnums;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository {
    boolean existsByUserAndAttendTimeBetween(User user, LocalDateTime today, LocalDateTime tomorrow);

    void save(Attendance attendance);

    List<Attendance> findUserAttendanceStatus(User user, LocalDateTime todayStart, LocalDateTime tomorrowStart);

    Optional<Attendance> findLastClockInRecord(User user, LocalDateTime todayStart, LocalDateTime tomorrowStart, CommonEnums.AttendanceStatus attendanceStatus);

    List<Attendance> findByUserId(String userId);


    List<AttendanceDto.Record> getAllAttendanceByCompany(String companyCode);

    List<AttendanceDto.Record> getTodayAttendance(String companyCode);


    Optional<Attendance> findById(Long attendanceNo);
// 조건으로 직원 출퇴근 정보 확인 , 개발중
//    List<Attendance> findByFilters(String userName, String deptName, LocalDate date);
}
