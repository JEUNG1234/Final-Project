package com.kh.sowm.service;

import com.kh.sowm.dto.ChallengeDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface ChallengeService {
    Long createChallenge(ChallengeDto.CreateRequest requestDto);

    Page<ChallengeDto.ListResponse> findAllChallenges(Pageable pageable);

    ChallengeDto.DetailResponse findChallengeById(Long challengeNo);

    Long createChallengeCompletion(Long challengeNo, ChallengeDto.CompletionRequest requestDto);

    boolean hasActiveChallenge(String userId);

    Map<String, Object> findMyChallenges(String userId);

    Page<ChallengeDto.CompletionResponse> findCompletionsByChallenge(Long challengeNo, Pageable pageable);

    // 특정 챌린지에 대한 나의 인증글 목록 페이징 조회 메소드 추가
    Page<ChallengeDto.CompletionResponse> findMyCompletionsByChallenge(Long challengeNo, String userId, Pageable pageable);


}