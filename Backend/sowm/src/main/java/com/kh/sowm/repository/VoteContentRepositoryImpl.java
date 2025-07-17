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

    // 투표 항목 저장 또는 수정
    @Override
    public VoteContent save(VoteContent voteContent) {
        if (voteContent.getVoteContentNo() == null) {
            em.persist(voteContent);
            return voteContent;
        } else {
            return em.merge(voteContent);
        }
    }

    // 투표 항목 여러 개 일괄 저장
    @Override
    public void saveAll(List<VoteContent> voteContents) {
        for (VoteContent content : voteContents) {
            em.persist(content);
        }
    }

    // ID로 투표 항목 조회
    @Override
    public Optional<VoteContent> findById(Long voteContentNo) {
        VoteContent voteContent = em.find(VoteContent.class, voteContentNo);
        return Optional.ofNullable(voteContent);
    }
}