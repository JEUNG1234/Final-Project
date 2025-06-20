package com.kh.sowm.repository;

import com.kh.sowm.entity.Vote;
import java.util.List;
import java.util.Optional;

public interface VoteRepository {

    // 투표 저장
    Vote save(Vote vote);

    // 모든 투표 조회
    List<Vote> findAll();

    // ID로 투표 조회
    Optional<Vote> findById(Long voteNo);
}