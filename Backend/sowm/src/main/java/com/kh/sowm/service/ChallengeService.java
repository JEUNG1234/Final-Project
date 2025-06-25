package com.kh.sowm.service;

import com.kh.sowm.dto.ChallengeDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ChallengeService {
    Long createChallenge(ChallengeDto.CreateRequest requestDto);

    Page<ChallengeDto.ListResponse> findAllChallenges(Pageable pageable);

    // 상세 조회를 위한 서비스 메소드 추가
    ChallengeDto.DetailResponse findChallengeById(Long challengeNo);
}