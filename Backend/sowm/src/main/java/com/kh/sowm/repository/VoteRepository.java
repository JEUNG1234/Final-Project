package com.kh.sowm.repository;

import com.kh.sowm.entity.Vote;
import java.util.List;
import java.util.Optional;

public interface VoteRepository {

    // 투표 저장 또는 수정
    Vote save(Vote vote);

    // 모든 투표 조회 (회사 코드로 필터링)
    List<Vote> findAll(String companyCode);

    // ID로 투표 조회
    Optional<Vote> findById(Long voteNo);

    // 투표 삭제
    void delete(Vote vote);
}