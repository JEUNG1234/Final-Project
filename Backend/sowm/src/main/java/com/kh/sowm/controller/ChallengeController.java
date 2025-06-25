package com.kh.sowm.controller;

import com.kh.sowm.dto.ChallengeDto;
import com.kh.sowm.dto.PageResponse; // PageResponse DTO 임포트
import com.kh.sowm.service.ChallengeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page; // Page 임포트
import org.springframework.data.domain.Pageable; // Pageable 임포트
import org.springframework.data.web.PageableDefault; // PageableDefault 임포트
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    /**
     * 페이징 처리된 전체 챌린지 목록을 조회하는 API
     * @param pageable (size, page, sort)
     * @return 챌린지 목록 DTO 페이지 응답
     */
    @GetMapping
    public ResponseEntity<PageResponse<ChallengeDto.ListResponse>> getAllChallenges(
            @PageableDefault(size = 8, sort = "challengeNo") Pageable pageable) {
        Page<ChallengeDto.ListResponse> challenges = challengeService.findAllChallenges(pageable);
        return ResponseEntity.ok(new PageResponse<>(challenges));
    }
}