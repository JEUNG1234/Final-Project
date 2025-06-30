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
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
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

    @GetMapping("/{challengeNo}")
    public ResponseEntity<ChallengeDto.DetailResponse> getChallengeById(@PathVariable Long challengeNo) {
        ChallengeDto.DetailResponse challenge = challengeService.findChallengeById(challengeNo);
        return ResponseEntity.ok(challenge);
    }

    @PostMapping("/{challengeNo}/complete")
    public ResponseEntity<Long> createCompletion(
            @PathVariable Long challengeNo,
            @RequestBody ChallengeDto.CompletionRequest requestDto) {
        Long completionId = challengeService.createChallengeCompletion(challengeNo, requestDto);
        return ResponseEntity.ok(completionId);
    }

    @GetMapping("/active-status")
    public ResponseEntity<Map<String, Boolean>> checkActiveChallenge(@RequestParam String userId) {
        boolean hasActive = challengeService.hasActiveChallenge(userId);
        return ResponseEntity.ok(Map.of("hasActiveChallenge", hasActive));
    }

    @GetMapping("/my")
    public ResponseEntity<Map<String, Object>> getMyChallenges(@RequestParam String userId) {
        Map<String, Object> myChallenges = challengeService.findMyChallenges(userId);
        return ResponseEntity.ok(myChallenges);
    }

    @GetMapping("/{challengeNo}/completions")
    public ResponseEntity<PageResponse<ChallengeDto.CompletionResponse>> getCompletionsByChallenge(
            @PathVariable Long challengeNo,
            @PageableDefault(size = 5, sort = "createdDate,desc") Pageable pageable) {
        Page<ChallengeDto.CompletionResponse> completions = challengeService.findCompletionsByChallenge(challengeNo, pageable);
        return ResponseEntity.ok(new PageResponse<>(completions));
    }

    @GetMapping("/{challengeNo}/my-completions")
    public ResponseEntity<PageResponse<ChallengeDto.CompletionResponse>> getMyCompletionsByChallenge(
            @PathVariable Long challengeNo,
            @RequestParam String userId,
            @PageableDefault(size = 5, sort = "createdDate,desc") Pageable pageable) {
        Page<ChallengeDto.CompletionResponse> completions = challengeService.findMyCompletionsByChallenge(challengeNo, userId, pageable);
        return ResponseEntity.ok(new PageResponse<>(completions));
    }

    // 인증글 상세 조회 컨트롤러 메서드 추가
    @GetMapping("/completion/{completionNo}")
    public ResponseEntity<ChallengeDto.CompletionResponse> getCompletionDetail(@PathVariable Long completionNo) {
        ChallengeDto.CompletionResponse completion = challengeService.getCompletionDetail(completionNo);
        return ResponseEntity.ok(completion);
    }

    // 대시보드쪽 챌린지 정보 가져오기
    @GetMapping("/getChallenge/{userId}")
    public ResponseEntity<ChallengeDto.CompletionResponse> getChallenge(@PathVariable String userId) {
        ChallengeDto.CompletionResponse challenge = challengeService.getChallenge(userId);
        return ResponseEntity.ok(challenge);
    }
}