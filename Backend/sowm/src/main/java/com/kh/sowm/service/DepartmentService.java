package com.kh.sowm.service;

import com.kh.sowm.dto.DepartmentDto;
import com.kh.sowm.entity.Department;

import java.util.List;

public interface DepartmentService {
    List<DepartmentDto.ResponseDto> getAllDepartments();
}
