package com.kh.sowm.controller;

import com.kh.sowm.dto.ChallengeDto;
import com.kh.sowm.service.ChallengeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}