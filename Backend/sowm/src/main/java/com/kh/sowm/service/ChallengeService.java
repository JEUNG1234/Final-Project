package com.kh.sowm.service;

import com.kh.sowm.dto.ChallengeDto;
import com.kh.sowm.dto.ChallengeDto.CompletionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface ChallengeService {
    // 챌린지 생성
    Long createChallenge(ChallengeDto.CreateRequest requestDto);

    // 모든 챌린지 목록 조회 (페이징, 사용자 ID 기반)
    Page<ChallengeDto.ListResponse> findAllChallenges(Pageable pageable, String userId);

    // 챌린지 ID로 상세 정보 조회
    ChallengeDto.DetailResponse findChallengeById(Long challengeNo);

    // 챌린지 참여(인증) 생성
    Long createChallengeCompletion(Long challengeNo, ChallengeDto.CompletionRequest requestDto);

    // 현재 진행 중인 챌린지 여부 확인
    boolean hasActiveChallenge(String userId);

    // 나의 모든 챌린지 목록 조회
    Map<String, Object> findMyChallenges(String userId);

    // 특정 챌린지의 모든 인증글 조회 (페이징)
    Page<ChallengeDto.CompletionResponse> findCompletionsByChallenge(Long challengeNo, Pageable pageable);

    // 특정 챌린지에 대한 나의 모든 인증글 조회 (페이징)
    Page<ChallengeDto.CompletionResponse> findMyCompletionsByChallenge(Long challengeNo, String userId, Pageable pageable);

    // 인증글 상세 조회
    ChallengeDto.CompletionResponse getCompletionDetail(Long completionNo);

    // 대시보드용 챌린지 정보 조회
    CompletionResponse getChallenge(String userId);
}