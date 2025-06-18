package com.kh.sowm.service;

import com.kh.sowm.dto.AttendanceDto;

import java.util.List;

public interface AttendanceService {
    String clockIn(String userId);

    String getTodayAttendanceStatus(String userId);

    String clockOut(String userId);

    List<AttendanceDto.Record> getAllAttendance(String userId);
}
