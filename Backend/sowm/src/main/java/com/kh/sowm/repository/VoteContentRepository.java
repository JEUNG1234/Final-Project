package com.kh.sowm.repository;

import com.kh.sowm.entity.VoteContent;
import java.util.List;
import java.util.Optional;

public interface VoteContentRepository {

    // 투표 항목 여러 개 일괄 저장
    void saveAll(List<VoteContent> voteContents);

    // ID로 투표 항목 조회
    Optional<VoteContent> findById(Long voteContentNo);
}