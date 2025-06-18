package com.kh.sowm.repository;

import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class WorkationRepositoryImpl implements WorkationRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(Workation workation) {
        em.persist(workation);
    }

    @Override
    public void save(WorkationLocation location) {
        em.persist(location);
    }
}
