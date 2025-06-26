package com.kh.sowm.repository;

import com.kh.sowm.entity.Challenge;
import com.kh.sowm.entity.ChallengeResult;
import com.kh.sowm.entity.User;

import java.util.Optional;

public interface ChallengeResultRepository {
    Optional<ChallengeResult> findByUserAndChallenge(User user, Challenge challenge);
    void save(ChallengeResult challengeResult);
}