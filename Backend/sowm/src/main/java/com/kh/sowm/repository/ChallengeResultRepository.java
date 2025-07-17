package com.kh.sowm.repository;

import com.kh.sowm.entity.Challenge;
import com.kh.sowm.entity.ChallengeResult;
import com.kh.sowm.entity.User;

import java.util.Optional;

public interface ChallengeResultRepository {
    // 사용자와 챌린지 정보로 챌린지 결과 조회
    Optional<ChallengeResult> findByUserAndChallenge(User user, Challenge challenge);

    // 챌린지 결과 저장
    void save(ChallengeResult challengeResult);
}