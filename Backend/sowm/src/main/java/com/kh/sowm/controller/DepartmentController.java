package com.kh.sowm.controller;

import com.kh.sowm.dto.DepartmentDto;
import com.kh.sowm.entity.Department;
import com.kh.sowm.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/department")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // 💡 포트 5174 -> 5173으로 수정
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<DepartmentDto.ResponseDto>> getDepartments() {
        List<DepartmentDto.ResponseDto> dept = departmentService.getAllDepartments();
        return ResponseEntity.ok(dept);
    }
}