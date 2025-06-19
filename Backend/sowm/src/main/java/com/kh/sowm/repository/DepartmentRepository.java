package com.kh.sowm.repository;

import com.kh.sowm.entity.Department;

import java.util.Optional;

public interface DepartmentRepository {
    Optional<Department> findById(String deptCode);
}
