package com.kh.sowm.controller;

import com.kh.sowm.dto.ChallengeDto;
import com.kh.sowm.dto.PageResponse;
import com.kh.sowm.service.ChallengeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5174", allowCredentials = "true")
public class ChallengeController {

    private final ChallengeService challengeService;

    @PostMapping
    public ResponseEntity<Long> createChallenge(@RequestBody ChallengeDto.CreateRequest requestDto) {
        Long newChallengeId = challengeService.createChallenge(requestDto);
        return ResponseEntity.ok(newChallengeId);
    }

    @GetMapping
    public ResponseEntity<PageResponse<ChallengeDto.ListResponse>> getAllChallenges(
            @PageableDefault(size = 8, sort = "challengeNo") Pageable pageable) {
        Page<ChallengeDto.ListResponse> challenges = challengeService.findAllChallenges(pageable);
        return ResponseEntity.ok(new PageResponse<>(challenges));
    }

    /**
     * 챌린지 상세 정보를 조회하는 API 추가
     * @param challengeNo 경로 변수로 받을 챌린지 ID
     * @return 챌린지 상세 DTO
     */
    @GetMapping("/{challengeNo}")
    public ResponseEntity<ChallengeDto.DetailResponse> getChallengeById(@PathVariable Long challengeNo) {
        ChallengeDto.DetailResponse challenge = challengeService.findChallengeById(challengeNo);
        return ResponseEntity.ok(challenge);
    }
}