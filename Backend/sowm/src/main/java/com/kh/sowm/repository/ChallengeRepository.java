package com.kh.sowm.repository;

import com.kh.sowm.entity.Challenge;
import com.kh.sowm.entity.Vote;

import java.util.Optional;

public interface ChallengeRepository {

    //  Challenge 저장 메서드
    void save(Challenge challenge);

    Optional<Challenge> findByVote(Vote vote);

    void delete(Challenge challenge);
}