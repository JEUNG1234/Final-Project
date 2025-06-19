package com.kh.sowm.repository;

import com.kh.sowm.entity.Department;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class DepartmentRepositoryImpl implements DepartmentRepository {

    @PersistenceContext
    EntityManager em;

    @Override
    public Optional<Department> findById(String deptCode) {
        return Optional.ofNullable(em.find(Department.class, deptCode));
    }
}
