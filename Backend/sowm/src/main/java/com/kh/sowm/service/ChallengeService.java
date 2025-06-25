package com.kh.sowm.service;

import com.kh.sowm.dto.ChallengeDto;

public interface ChallengeService {
    Long createChallenge(ChallengeDto.CreateRequest requestDto);
}