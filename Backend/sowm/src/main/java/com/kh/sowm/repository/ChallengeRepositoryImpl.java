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

import java.util.List;
import java.util.Optional;

@Repository
public class ChallengeRepositoryImpl implements ChallengeRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(Challenge challenge) {
        em.persist(challenge);
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

    /**
     * 페이징을 적용하여 모든 챌린지 목록을 조회
     * @param pageable 페이징 정보
     * @return 챌린지 엔티티 페이지 객체
     */
    @Override
    public Page<Challenge> findAll(Pageable pageable) {
        // 데이터 조회 쿼리
        TypedQuery<Challenge> query = em.createQuery("SELECT c FROM Challenge c ORDER BY c.challengeNo DESC", Challenge.class);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());
        List<Challenge> challenges = query.getResultList();

        // 전체 카운트 조회 쿼리
        TypedQuery<Long> countQuery = em.createQuery("SELECT count(c) FROM Challenge c", Long.class);
        long total = countQuery.getSingleResult();

        return new PageImpl<>(challenges, pageable, total);
    }
}