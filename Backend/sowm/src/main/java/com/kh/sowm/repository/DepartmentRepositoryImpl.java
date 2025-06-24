package com.kh.sowm.repository;

import com.kh.sowm.entity.Department;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class DepartmentRepositoryImpl implements DepartmentRepository {

    @PersistenceContext
    EntityManager em;

    @Override
    public Optional<Department> findById(String deptCode) {
        return Optional.ofNullable(em.find(Department.class, deptCode));
    }

    @Override
    public List<Department> findAll() {
        return em.createQuery("SELECT d FROM Department d", Department.class)
                .getResultList();
    }
}
