package com.kh.sowm.repository;

import com.kh.sowm.entity.ChallengeComplete;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.Optional;

public interface ChallengeCompleteRepository {
    void save(ChallengeComplete challengeComplete);

    // 사용자의 현재 진행 중인 챌린지 참여 기록 조회
    Optional<ChallengeComplete> findActiveChallengeByUserId(String userId, LocalDate today);

    // 특정 챌린지의 인증글 페이징 조회
    Page<ChallengeComplete> findByChallenge_ChallengeNo(Long challengeNo, Pageable pageable);

    // 특정 챌린지의 특정 사용자 인증글 페이징 조회
    Page<ChallengeComplete> findByChallenge_ChallengeNoAndUser_UserId(Long challengeNo, String userId, Pageable pageable);

    // ID로 단일 인증글 조회 메서드 추가
    Optional<ChallengeComplete> findById(Long completeNo);
}