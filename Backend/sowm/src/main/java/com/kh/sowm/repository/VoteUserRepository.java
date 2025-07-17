package com.kh.sowm.repository;

import com.kh.sowm.entity.User;
import com.kh.sowm.entity.VoteUser;

import java.util.List;
import java.util.Set;

public interface VoteUserRepository {

    // 투표 참여 기록 저장
    void save(VoteUser voteUser);

    // 특정 투표에 특정 사용자가 참여했는지 여부 확인
    boolean existsByVoteNoAndUserId(Long voteNo, String userId);

    // 특정 사용자의 모든 투표 참여 기록 조회
    List<VoteUser> findVoteUsersByUserId(String userId);

    // 특정 투표 항목에 투표한 사용자 목록 조회
    List<User> findVotersByVoteContentNo(Long voteContentNo);
}