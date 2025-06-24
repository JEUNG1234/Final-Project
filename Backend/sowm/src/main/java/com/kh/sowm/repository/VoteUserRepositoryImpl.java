package com.kh.sowm.repository;

import com.kh.sowm.entity.User;
import com.kh.sowm.entity.VoteUser;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @Override
    public List<VoteUser> findVoteUsersByUserId(String userId) {
        return em.createQuery("SELECT vu FROM VoteUser vu WHERE vu.user.userId = :userId", VoteUser.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    @Override
    public List<User> findVotersByVoteContentNo(Long voteContentNo) {
        return em.createQuery(
                        "SELECT vu.user FROM VoteUser vu WHERE vu.voteContent.voteContentNo = :voteContentNo", User.class)
                .setParameter("voteContentNo", voteContentNo)
                .getResultList();
    }
}