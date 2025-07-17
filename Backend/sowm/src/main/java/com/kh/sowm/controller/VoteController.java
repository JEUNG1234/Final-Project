package com.kh.sowm.controller;

import com.kh.sowm.dto.PageResponse;
import com.kh.sowm.dto.VoteDto;
import com.kh.sowm.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class VoteController {

    private final VoteService voteService;

    // 투표 생성
    @PostMapping
    public ResponseEntity<Long> createVote(@RequestBody VoteDto.CreateRequest createRequest) {
        Long voteId = voteService.createVote(createRequest, createRequest.getUserId());
        return ResponseEntity.ok(voteId);
    }

    // 모든 투표 목록 조회 (페이징)
    @GetMapping
    public ResponseEntity<PageResponse<VoteDto.ListResponse>> getAllVotes(@RequestParam String userId, Pageable pageable) {
        PageResponse<VoteDto.ListResponse> votes = voteService.getAllVotes(userId, pageable);
        return ResponseEntity.ok(votes);
    }

    // 투표 상세 정보 조회
    @GetMapping("/{voteNo}")
    public ResponseEntity<VoteDto.DetailResponse> getVoteDetails(@PathVariable Long voteNo) {
        VoteDto.DetailResponse voteDetails = voteService.getVoteDetails(voteNo);
        return ResponseEntity.ok(voteDetails);
    }

    // 투표하기
    @PostMapping("/{voteNo}/cast")
    public ResponseEntity<Void> castVote(@PathVariable Long voteNo,
                                         @RequestBody VoteDto.CastRequest castRequest) {
        voteService.castVote(voteNo, castRequest.getVoteContentNo(), castRequest.getUserId());
        return ResponseEntity.ok().build();
    }

    // 투표 삭제
    @DeleteMapping("/{voteNo}")
    public ResponseEntity<Void> deleteVote(@PathVariable Long voteNo, @RequestParam String userId) {
        voteService.deleteVote(voteNo, userId);
        return ResponseEntity.noContent().build();
    }

    // 특정 투표 항목의 투표자 목록 조회
    @GetMapping("/{voteNo}/options/{voteContentNo}/voters")
    public ResponseEntity<?> getVotersForOption(
            @PathVariable Long voteNo,
            @PathVariable Long voteContentNo) {

        VoteDto.DetailResponse voteDetails = voteService.getVoteDetails(voteNo);
        if (voteDetails.isAnonymous()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("익명 투표의 참여자 목록은 볼 수 없습니다.");
        }

        List<VoteDto.VoterResponse> voters = voteService.getVotersForOption(voteContentNo);
        return ResponseEntity.ok(voters);
    }

    // 투표 응답률 통계 조회
    @GetMapping("/statistics/response-rate")
    public ResponseEntity<Map<String, Double>> getVoteResponseRateStatistics(@RequestParam String companyCode) {
        Map<String, Double> stats = voteService.getVoteResponseRateStatistics(companyCode);
        return ResponseEntity.ok(stats);
    }
}