package com.kh.sowm.service;

import com.kh.sowm.dto.ChallengeDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ChallengeService {
    Long createChallenge(ChallengeDto.CreateRequest requestDto);

    // Pageable을 받도록 수정
    Page<ChallengeDto.ListResponse> findAllChallenges(Pageable pageable);
}