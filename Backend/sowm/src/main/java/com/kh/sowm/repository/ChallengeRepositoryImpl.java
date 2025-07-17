package com.kh.sowm.repository;

import com.kh.sowm.entity.Challenge;
import com.kh.sowm.entity.Vote;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class ChallengeRepositoryImpl implements ChallengeRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(Challenge challenge) {
        if (!em.contains(challenge)) {
            em.persist(em.merge(challenge));
        } else {
            em.persist(challenge);
        }
    }

    @Override
    public Optional<Challenge> findByVote(Vote vote) {
        try {
            return Optional.of(em.createQuery("SELECT c FROM Challenge c WHERE c.vote = :vote", Challenge.class)
                    .setParameter("vote", vote)
                    .getSingleResult());
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    @Override
    public void delete(Challenge challenge) {
        if (!em.contains(challenge)) {
            em.remove(em.merge(challenge));
        } else {
            em.remove(challenge);
        }
    }


    @Override
    public Page<Challenge> findAll(Pageable pageable, String companyCode) {
        // JPQL 수정: User 엔티티와 조인하여 companyCode로 필터링
        String jpql = "SELECT c FROM Challenge c JOIN c.user u WHERE u.companyCode = :companyCode ORDER BY c.challengeNo DESC";
        TypedQuery<Challenge> query = em.createQuery(jpql, Challenge.class)
                .setParameter("companyCode", companyCode);

        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());
        List<Challenge> challenges = query.getResultList();

        // Count 쿼리 수정
        String countJpql = "SELECT COUNT(c) FROM Challenge c JOIN c.user u WHERE u.companyCode = :companyCode";
        TypedQuery<Long> countQuery = em.createQuery(countJpql, Long.class)
                .setParameter("companyCode", companyCode);
        long total = countQuery.getSingleResult();

        return new PageImpl<>(challenges, pageable, total);
    }

    // ... (findById 이하 기존과 동일)
    @Override
    public Optional<Challenge> findById(Long challengeNo) {
        return Optional.ofNullable(em.find(Challenge.class, challengeNo));
    }

    @Override
    public List<Challenge> findCompletedChallengesByUserId(String userId, LocalDate today) {
        String jpql = "SELECT DISTINCT c FROM Challenge c " +
                "JOIN c.completions cc " +
                "WHERE cc.user.userId = :userId " +
                "AND c.challengeEndDate < :today";
        return em.createQuery(jpql, Challenge.class)
                .setParameter("userId", userId)
                .setParameter("today", today)
                .getResultList();
    }

    @Override
    public List<Challenge> findAllByUserId(String userId) {
        String jpql = "SELECT DISTINCT c FROM Challenge c " +
                "JOIN c.completions cc " +
                "WHERE cc.user.userId = :userId " +
                "ORDER BY c.challengeStartDate DESC";
        return em.createQuery(jpql, Challenge.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    @Override
    public Optional<Challenge> findDashBoardChallenge(String companyCode) {
        String jpql = "SELECT c FROM Challenge c WHERE c.user.company.companyCode = :companyCode ORDER BY c.challengeStartDate DESC";

        List<Challenge> resultList = em.createQuery(jpql, Challenge.class)
                .setParameter("companyCode", companyCode)
                .setMaxResults(1)
                .getResultList();

        return resultList.stream().findFirst();
    }
}