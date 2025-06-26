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
import java.util.Map;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // 💡 포트 5174 -> 5173으로 수정
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

    /**
     * 챌린지 참여(인증) API 추가
     * @param challengeNo 참여할 챌린지 ID
     * @param requestDto 인증글 내용 (title, content, userId)
     * @return 생성된 인증글의 ID
     */
    @PostMapping("/{challengeNo}/complete")
    public ResponseEntity<Long> createCompletion(
            @PathVariable Long challengeNo,
            @RequestBody ChallengeDto.CompletionRequest requestDto) {
        Long completionId = challengeService.createChallengeCompletion(challengeNo, requestDto);
        return ResponseEntity.ok(completionId);
    }

    /**
     * 사용자의 활성 챌린지 참여 상태를 확인하는 API 추가
     * @param userId 확인할 사용자의 ID
     * @return 활성 챌린지 참여 여부 (true/false)
     */
    @GetMapping("/active-status")
    public ResponseEntity<Map<String, Boolean>> checkActiveChallenge(@RequestParam String userId) {
        boolean hasActive = challengeService.hasActiveChallenge(userId);
        return ResponseEntity.ok(Map.of("hasActiveChallenge", hasActive));
    }

    /**
     * 사용자의 챌린지 목록(진행중/완료)을 조회하는 API 추가
     * @param userId 조회할 사용자의 ID
     * @return 챌린지 목록 DTO
     */
    @GetMapping("/my")
    public ResponseEntity<Map<String, Object>> getMyChallenges(@RequestParam String userId) {
        Map<String, Object> myChallenges = challengeService.findMyChallenges(userId);
        return ResponseEntity.ok(myChallenges);
    }
}