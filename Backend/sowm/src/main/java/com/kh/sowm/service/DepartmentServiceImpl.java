package com.kh.sowm.service;

import com.kh.sowm.dto.DepartmentDto;
import com.kh.sowm.entity.Department;
import com.kh.sowm.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    // 전체 부서 조회하는 메소드
    @Override
    public List<DepartmentDto.ResponseDto> getAllDepartments() {
        List<Department> departments =  departmentRepository.findAll();

        return departments.stream()
                .map(dept -> DepartmentDto.ResponseDto.builder()
                        .deptName(dept.getDeptName())
                        .build())
                .collect(Collectors.toList());

    }
}
