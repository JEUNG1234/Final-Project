package com.kh.sowm.repository;

import com.kh.sowm.entity.MedicalCheckHeadScore;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class MedicalCheckHeadScoreRepositoryImpl implements MedicalCheckHeadScoreRepository {

    @PersistenceContext
    EntityManager em;

    @Override
    public void save(MedicalCheckHeadScore headScore) {
        em.persist(headScore);
    }
}
