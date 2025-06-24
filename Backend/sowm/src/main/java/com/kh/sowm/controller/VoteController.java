// src/main/java/com/kh/sowm/controller/VoteController.java

package com.kh.sowm.controller;

import com.kh.sowm.dto.VoteDto;
import com.kh.sowm.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class VoteController {

    private final VoteService voteService;

    /**
     * 투표 생성 API
     * @param createRequest 프론트에서 받은 투표 정보 (userId 포함)
     * @return 생성된 투표의 ID
     */
    @PostMapping
    public ResponseEntity<Long> createVote(@RequestBody VoteDto.CreateRequest createRequest) {
        Long voteId = voteService.createVote(createRequest, createRequest.getUserId());
        return ResponseEntity.ok(voteId);
    }

    /**
     * 모든 투표 목록 조회 API
     * @param userId 현재 접속한 사용자의 ID (프론트에서 쿼리 파라미터로 전달)
     * @return 해당 사용자의 투표 여부가 포함된 투표 목록
     */
    @GetMapping
    public ResponseEntity<List<VoteDto.ListResponse>> getAllVotes(@RequestParam String userId) {
        List<VoteDto.ListResponse> votes = voteService.getAllVotes(userId);
        return ResponseEntity.ok(votes);
    }

    /**
     * 투표 상세 결과 조회 API
     * @param voteNo 조회할 투표의 ID
     * @return 투표 상세 정보
     */
    @GetMapping("/{voteNo}")
    public ResponseEntity<VoteDto.DetailResponse> getVoteDetails(@PathVariable Long voteNo) {
        VoteDto.DetailResponse voteDetails = voteService.getVoteDetails(voteNo);
        return ResponseEntity.ok(voteDetails);
    }

    /**
     * 투표하기 API
     * @param voteNo 참여할 투표의 ID
     * @param castRequest 선택한 항목 ID와 투표자 ID 정보
     * @return 성공 응답
     */
    @PostMapping("/{voteNo}/cast")
    public ResponseEntity<Void> castVote(@PathVariable Long voteNo,
                                         @RequestBody VoteDto.CastRequest castRequest) {
        voteService.castVote(voteNo, castRequest.getVoteContentNo(), castRequest.getUserId());
        return ResponseEntity.ok().build();
    }

    /**
     *  투표 삭제 API
     * @param voteNo 삭제할 투표의 ID
     * @param userId 요청한 사용자의 ID (권한 확인용)
     * @return 성공 응답
     */
    @DeleteMapping("/{voteNo}")
    public ResponseEntity<Void> deleteVote(@PathVariable Long voteNo, @RequestParam String userId) {
        voteService.deleteVote(voteNo, userId);
        return ResponseEntity.noContent().build();
    }
}