package com.kh.sowm.repository;

import com.kh.sowm.entity.ChallengeComplete;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public class ChallengeCompleteRepositoryImpl implements ChallengeCompleteRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(ChallengeComplete challengeComplete) {
        em.persist(challengeComplete);
    }

    @Override
    public Optional<ChallengeComplete> findActiveChallengeByUserId(String userId, LocalDate today) {
        String jpql = "SELECT cc FROM ChallengeComplete cc " +
                "JOIN cc.challenge c " +
                "WHERE cc.user.userId = :userId " +
                "AND :today BETWEEN c.challengeStartDate AND c.challengeEndDate";
        try {
            ChallengeComplete result = em.createQuery(jpql, ChallengeComplete.class)
                    .setParameter("userId", userId)
                    .setParameter("today", today)
                    .setMaxResults(1)
                    .getSingleResult();
            return Optional.of(result);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }
}