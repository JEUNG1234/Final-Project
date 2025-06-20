package com.kh.sowm.repository;

import com.kh.sowm.entity.VoteUser;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class VoteUserRepositoryImpl implements VoteUserRepository {

    @PersistenceContext
    private final EntityManager em;

    @Override
    public void save(VoteUser voteUser) {
        em.persist(voteUser);
    }

    @Override
    public boolean existsByVoteNoAndUserId(Long voteNo, String userId) {
        Long count = em.createQuery(
                        "SELECT COUNT(vu) FROM VoteUser vu WHERE vu.vote.voteNo = :voteNo AND vu.user.userId = :userId", Long.class)
                .setParameter("voteNo", voteNo)
                .setParameter("userId", userId)
                .getSingleResult();
        return count > 0;
    }
}