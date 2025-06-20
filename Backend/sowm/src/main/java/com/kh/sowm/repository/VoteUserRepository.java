package com.kh.sowm.repository;

import com.kh.sowm.entity.VoteUser;

public interface VoteUserRepository {

    // 사용자 투표 기록 저장
    void save(VoteUser voteUser);

    // 특정 사용자가 특정 투표에 참여했는지 확인
    boolean existsByVoteNoAndUserId(Long voteNo, String userId);
}