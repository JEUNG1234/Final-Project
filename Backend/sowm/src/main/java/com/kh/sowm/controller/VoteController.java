package com.kh.sowm.controller;

import com.kh.sowm.dto.VoteDto;
import com.kh.sowm.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 투표 관련 API 요청을 처리하는 컨트롤러 클래스입니다.
 */
@RestController
@RequestMapping("/api/votes") // 이 컨트롤러의 모든 API는 /api/votes 경로로 시작합니다.
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // React 개발 서버(5173 포트)의 요청을 허용합니다.
public class VoteController {

    private final VoteService voteService;

    /**
     * 새로운 투표를 생성하는 API 입니다.
     * @param createRequest 투표 생성에 필요한 정보 (JSON)
     * @return 생성된 투표의 ID
     */
    @PostMapping
    public ResponseEntity<Long> createVote(@RequestBody VoteDto.CreateRequest createRequest) {
        Long voteId = voteService.createVote(createRequest);
        return ResponseEntity.ok(voteId); // 성공 시 200 OK와 함께 voteId 반환
    }

    /**
     * 모든 투표 목록을 조회하는 API 입니다.
     * @return 투표 목록 (JSON 배열)
     */
    @GetMapping
    public ResponseEntity<List<VoteDto.VoteListResponse>> getAllVotes() {
        List<VoteDto.VoteListResponse> votes = voteService.getAllVotes();
        return ResponseEntity.ok(votes);
    }

    /**
     * 특정 투표의 상세 정보를 조회하는 API 입니다.
     * @param voteNo URL 경로에 포함된 투표 ID
     * @return 투표 상세 정보 (JSON 객체)
     */
    @GetMapping("/{voteNo}")
    public ResponseEntity<VoteDto.VoteDetailResponse> getVoteDetails(@PathVariable Long voteNo) {
        VoteDto.VoteDetailResponse voteDetails = voteService.getVoteDetails(voteNo);
        return ResponseEntity.ok(voteDetails);
    }
}