package com.kh.sowm.repository;

import com.kh.sowm.entity.Vacation;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class VacationRepositoryImpl implements VacationRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(Vacation vacation) {
        em.persist(vacation);
    }

    @Override
    public long countByUserId(String userId) {
        return em.createQuery("SELECT COUNT(v) FROM Vacation v WHERE v.user.userId = :userId", Long.class)
                .setParameter("userId", userId)
                .getSingleResult();
    }
}