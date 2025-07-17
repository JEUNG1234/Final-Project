package com.kh.sowm.repository;

import com.kh.sowm.entity.Challenge;
import com.kh.sowm.entity.ChallengeResult;
import com.kh.sowm.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class ChallengeResultRepositoryImpl implements ChallengeResultRepository {

    @PersistenceContext
    private EntityManager em;

    // 사용자와 챌린지 정보로 챌린지 결과 조회
    @Override
    public Optional<ChallengeResult> findByUserAndChallenge(User user, Challenge challenge) {
        try {
            return Optional.of(em.createQuery("SELECT cr FROM ChallengeResult cr WHERE cr.user = :user AND cr.challenge = :challenge", ChallengeResult.class)
                    .setParameter("user", user)
                    .setParameter("challenge", challenge)
                    .getSingleResult());
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    // 챌린지 결과 저장
    @Override
    public void save(ChallengeResult challengeResult) {
        em.persist(challengeResult);
    }
}