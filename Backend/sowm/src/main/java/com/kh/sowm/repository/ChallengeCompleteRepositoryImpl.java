package com.kh.sowm.repository;

import com.kh.sowm.entity.ChallengeComplete;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
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

    @Override
    public Page<ChallengeComplete> findByChallenge_ChallengeNo(Long challengeNo, Pageable pageable) {
        // 데이터 조회를 위한 JPQL
        String jpql = "SELECT cc FROM ChallengeComplete cc WHERE cc.challenge.challengeNo = :challengeNo ORDER BY cc.createdDate DESC";
        TypedQuery<ChallengeComplete> query = em.createQuery(jpql, ChallengeComplete.class);
        query.setParameter("challengeNo", challengeNo);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());
        List<ChallengeComplete> completions = query.getResultList();

        // 전체 카운트 조회를 위한 JPQL
        String countJpql = "SELECT count(cc) FROM ChallengeComplete cc WHERE cc.challenge.challengeNo = :challengeNo";
        TypedQuery<Long> countQuery = em.createQuery(countJpql, Long.class);
        countQuery.setParameter("challengeNo", challengeNo);
        long total = countQuery.getSingleResult();

        return new PageImpl<>(completions, pageable, total);
    }

    @Override
    public Page<ChallengeComplete> findByChallenge_ChallengeNoAndUser_UserId(Long challengeNo, String userId, Pageable pageable) {
        // 데이터 조회를 위한 JPQL
        String jpql = "SELECT cc FROM ChallengeComplete cc " +
                "WHERE cc.challenge.challengeNo = :challengeNo AND cc.user.userId = :userId " +
                "ORDER BY cc.createdDate DESC";
        TypedQuery<ChallengeComplete> query = em.createQuery(jpql, ChallengeComplete.class);
        query.setParameter("challengeNo", challengeNo);
        query.setParameter("userId", userId);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());
        List<ChallengeComplete> completions = query.getResultList();

        // 전체 카운트 조회를 위한 JPQL
        String countJpql = "SELECT count(cc) FROM ChallengeComplete cc " +
                "WHERE cc.challenge.challengeNo = :challengeNo AND cc.user.userId = :userId";
        TypedQuery<Long> countQuery = em.createQuery(countJpql, Long.class);
        countQuery.setParameter("challengeNo", challengeNo);
        countQuery.setParameter("userId", userId);
        long total = countQuery.getSingleResult();

        return new PageImpl<>(completions, pageable, total);
    }
}