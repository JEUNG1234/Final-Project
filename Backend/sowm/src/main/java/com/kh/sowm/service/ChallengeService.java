package com.kh.sowm.service;

import com.kh.sowm.dto.ChallengeDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface ChallengeService {
    Long createChallenge(ChallengeDto.CreateRequest requestDto);

    Page<ChallengeDto.ListResponse> findAllChallenges(Pageable pageable);

    // 상세 조회를 위한 서비스 메소드 추가
    ChallengeDto.DetailResponse findChallengeById(Long challengeNo);

    // 챌린지 참여(인증) 메소드 추가
    Long createChallengeCompletion(Long challengeNo, ChallengeDto.CompletionRequest requestDto);

    // 사용자의 활성 챌린지 참여 여부 확인 메소드 추가
    boolean hasActiveChallenge(String userId);

    // 나의 챌린지 목록 조회 메소드 추가
    Map<String, Object> findMyChallenges(String userId);
}