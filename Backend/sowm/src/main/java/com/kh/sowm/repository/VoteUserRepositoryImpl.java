package com.kh.sowm.repository;

import com.kh.sowm.entity.VoteUser;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.Set;

@Repository
@RequiredArgsConstructor
public class VoteUserRepositoryImpl implements VoteUserRepository {

    @PersistenceContext
    private final EntityManager em;

    @Override
    public void save(VoteUser voteUser) {
        em.persist(voteUser);
        // em.flush(); // ✅ 이전에 추가했던 flush() 제거
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

    @Override
    public Set<Long> findVotedVoteNosByUserId(String userId) {
        return new HashSet<>(em.createQuery(
                        "SELECT vu.vote.voteNo FROM VoteUser vu WHERE vu.user.userId = :userId", Long.class)
                .setParameter("userId", userId)
                .getResultList());
    }
}