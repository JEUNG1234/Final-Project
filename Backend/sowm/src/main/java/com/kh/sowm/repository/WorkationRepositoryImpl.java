package com.kh.sowm.repository;

import com.kh.sowm.entity.Attendance;
import com.kh.sowm.entity.Workation;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

@Repository
public class WorkationRepositoryImpl implements WorkationRepository {

    @PersistenceContext
    private EntityManager em;


    @Override
    public Workation save(Workation workation) {
        em.persist(workation);
        return workation;
    }
}
