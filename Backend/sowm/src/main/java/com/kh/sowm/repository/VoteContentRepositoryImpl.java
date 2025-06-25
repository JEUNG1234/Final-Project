package com.kh.sowm.repository;

import com.kh.sowm.entity.VoteContent;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class VoteContentRepositoryImpl implements VoteContentRepository {

    @PersistenceContext
    private final EntityManager em;

    @Override
    public VoteContent save(VoteContent voteContent) {
        if (voteContent.getVoteContentNo() == null) {
            em.persist(voteContent);
            return voteContent;
        } else {
            return em.merge(voteContent);
        }
    }

    @Override
    public void saveAll(List<VoteContent> voteContents) {
        for (VoteContent content : voteContents) {
            em.persist(content);
        }
    }

    @Override
    public Optional<VoteContent> findById(Long voteContentNo) {
        VoteContent voteContent = em.find(VoteContent.class, voteContentNo);
        return Optional.ofNullable(voteContent);
    }
}