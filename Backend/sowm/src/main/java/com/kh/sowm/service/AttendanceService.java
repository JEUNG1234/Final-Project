package com.kh.sowm.service;

public interface AttendanceService {
    String clockIn(String userId);

    String getTodayAttendanceStatus(String userId);

    String clockOut(String userId);
}
