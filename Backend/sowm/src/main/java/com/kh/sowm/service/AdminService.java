package com.kh.sowm.service;

import com.kh.sowm.dto.AttendanceDto;

import java.time.LocalDate;
import java.util.List;

public interface AdminService {

    List<AttendanceDto.Record> getAllAttendanceByCompany(String userId);

    List<AttendanceDto.Record> getTodayAttendance(String userId);

    AttendanceDto.Record updateAttendance(AttendanceDto.UpdateRequest request);

    // 조건으로 직원 출퇴근 정보 확인 , 개발중
//    List<AttendanceDto.Record> getAttendances(String userName, String deptName, LocalDate date);
}
