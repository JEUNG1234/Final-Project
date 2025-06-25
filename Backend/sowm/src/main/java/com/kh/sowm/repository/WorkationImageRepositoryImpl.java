package com.kh.sowm.repository;

import com.kh.sowm.entity.WorkationImage;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class WorkationImageRepositoryImpl implements WorkationImageRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(WorkationImage image) {
        em.persist(image);

    }
}
