package com.kh.sowm.repository;

import com.kh.sowm.entity.Vote;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class VoteRepositoryImpl implements VoteRepository {

    @PersistenceContext
    private final EntityManager em;

    @Override
    public Vote save(Vote vote) {
        em.persist(vote);
        return vote;
    }

    @Override
    public List<Vote> findAll() {
        return em.createQuery("SELECT v FROM Vote v ORDER BY v.voteNo DESC", Vote.class)
                .getResultList();
    }

    @Override
    public Optional<Vote> findById(Long voteNo) {
        Vote vote = em.find(Vote.class, voteNo);
        return Optional.ofNullable(vote);
    }
}