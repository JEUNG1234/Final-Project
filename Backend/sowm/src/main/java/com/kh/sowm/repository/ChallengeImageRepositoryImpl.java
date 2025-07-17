package com.kh.sowm.repository;

import com.kh.sowm.entity.ChallengeImage;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class ChallengeImageRepositoryImpl implements ChallengeImageRepository {

    @PersistenceContext
    private EntityManager em;

    // 챌린지 이미지 저장
    @Override
    public void save(ChallengeImage challengeImage) {
        em.persist(challengeImage);
    }
}