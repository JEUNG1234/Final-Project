package com.kh.sowm.service;

import com.kh.sowm.dto.AttendanceDto;
import com.kh.sowm.dto.AttendanceDto.Record;
import com.kh.sowm.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;

public interface AdminService {

    PageResponse<AttendanceDto.Record> getAllAttendanceByCompany(String userId, Pageable pageable);

    List<AttendanceDto.Record> getTodayAttendance(String userId);

    AttendanceDto.Record updateAttendance(AttendanceDto.UpdateRequest request);

    PageResponse<AttendanceDto.Record> getAttendances(String companyCode, String userName, String deptName, LocalDate date, Pageable pageable);

    ResponseEntity<List<AttendanceDto.WeeklyAttendanceDto>> getWeeklyAttendance(String companyCode);
}
