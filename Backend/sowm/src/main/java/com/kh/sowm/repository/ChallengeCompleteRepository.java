package com.kh.sowm.repository;

import com.kh.sowm.entity.ChallengeComplete;

import java.time.LocalDate;
import java.util.Optional;

public interface ChallengeCompleteRepository {
    void save(ChallengeComplete challengeComplete);

    // 사용자의 현재 진행 중인 챌린지 참여 기록 조회
    Optional<ChallengeComplete> findActiveChallengeByUserId(String userId, LocalDate today);
}