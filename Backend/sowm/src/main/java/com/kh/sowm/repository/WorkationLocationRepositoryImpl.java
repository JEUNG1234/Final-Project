package com.kh.sowm.repository;

import com.kh.sowm.entity.WorkationLocation;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class WorkationLocationRepositoryImpl implements WorkationLocationRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    //워케이션 생성용
    public WorkationLocation save(WorkationLocation location) {
        em.persist(location);
        return location;
    }

    @Override
    public WorkationLocation updateLocation(WorkationLocation location) {
        em.merge(location);
        return location;
    }
}
