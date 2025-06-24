package com.kh.sowm.repository;

import com.kh.sowm.entity.VoteUser;

import java.util.Set;

public interface VoteUserRepository {

    void save(VoteUser voteUser);

    boolean existsByVoteNoAndUserId(Long voteNo, String userId);

    Set<Long> findVotedVoteNosByUserId(String userId);
}