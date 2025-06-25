package com.kh.sowm.repository;

import com.kh.sowm.entity.User;
import com.kh.sowm.entity.VoteUser;

import java.util.List;
import java.util.Set;

public interface VoteUserRepository {

    void save(VoteUser voteUser);

    boolean existsByVoteNoAndUserId(Long voteNo, String userId);

    List<VoteUser> findVoteUsersByUserId(String userId);

    List<User> findVotersByVoteContentNo(Long voteContentNo);
}