package com.kh.sowm.repository;

import com.kh.sowm.entity.User;
import com.kh.sowm.entity.Vote;
import com.kh.sowm.entity.VoteUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoteUserRepository extends JpaRepository<VoteUser, Integer> {
    boolean existsByVoteAndUser(Vote vote, User user);
    boolean existsByVoteVoteNoAndUserUserId(int voteNo, String userId);
}