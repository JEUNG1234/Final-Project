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

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class VoteController {

    private final VoteService voteService;

    @PostMapping
    public ResponseEntity<Long> createVote(@RequestBody VoteDto.CreateRequest createRequest) {
        Long voteId = voteService.createVote(createRequest, createRequest.getUserId());
        return ResponseEntity.ok(voteId);
    }

    @GetMapping
    public ResponseEntity<PageResponse<VoteDto.ListResponse>> getAllVotes(@RequestParam String userId, Pageable pageable) {
        PageResponse<VoteDto.ListResponse> votes = voteService.getAllVotes(userId, pageable);
        return ResponseEntity.ok(votes);
    }

    @GetMapping("/{voteNo}")
    public ResponseEntity<VoteDto.DetailResponse> getVoteDetails(@PathVariable Long voteNo) {
        VoteDto.DetailResponse voteDetails = voteService.getVoteDetails(voteNo);
        return ResponseEntity.ok(voteDetails);
    }

    @PostMapping("/{voteNo}/cast")
    public ResponseEntity<Void> castVote(@PathVariable Long voteNo,
                                         @RequestBody VoteDto.CastRequest castRequest) {
        voteService.castVote(voteNo, castRequest.getVoteContentNo(), castRequest.getUserId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{voteNo}")
    public ResponseEntity<Void> deleteVote(@PathVariable Long voteNo, @RequestParam String userId) {
        voteService.deleteVote(voteNo, userId);
        return ResponseEntity.noContent().build();
    }

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
}