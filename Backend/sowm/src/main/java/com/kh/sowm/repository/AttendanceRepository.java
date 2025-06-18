package com.kh.sowm.repository;

import com.kh.sowm.entity.Attendance;
import com.kh.sowm.entity.User;
import com.kh.sowm.enums.CommonEnums;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository {
    boolean existsByUserAndAttendTimeBetween(User user, LocalDateTime today, LocalDateTime tomorrow);

    void save(Attendance attendance);

    List<Attendance> findUserAttendanceStatus(User user, LocalDateTime todayStart, LocalDateTime tomorrowStart);

    Optional<Attendance> findLastClockInRecord(User user, LocalDateTime todayStart, LocalDateTime tomorrowStart, CommonEnums.AttendanceStatus attendanceStatus);

    List<Attendance> findByUserId(String userId);

}
