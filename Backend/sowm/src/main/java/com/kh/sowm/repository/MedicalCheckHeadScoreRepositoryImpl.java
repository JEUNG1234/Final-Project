package com.kh.sowm.repository;

import com.kh.sowm.entity.MedicalCheckHeadScore;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

// 검사 점수 별 항목 저장하는 레파지토리
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
