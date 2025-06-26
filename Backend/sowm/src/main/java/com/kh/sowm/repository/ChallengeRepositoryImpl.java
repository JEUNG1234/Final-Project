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

    @Override
    public Page<Challenge> findAll(Pageable pageable) {
        TypedQuery<Challenge> query = em.createQuery("SELECT c FROM Challenge c ORDER BY c.challengeNo DESC", Challenge.class);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());
        List<Challenge> challenges = query.getResultList();

        TypedQuery<Long> countQuery = em.createQuery("SELECT count(c) FROM Challenge c", Long.class);
        long total = countQuery.getSingleResult();

        return new PageImpl<>(challenges, pageable, total);
    }

    /**
     * ID로 챌린지 조회 구현
     * @param challengeNo 조회할 챌린지 ID
     * @return 챌린지 Optional 객체
     */
    @Override
    public Optional<Challenge> findById(Long challengeNo) {
        return Optional.ofNullable(em.find(Challenge.class, challengeNo));
    }
}