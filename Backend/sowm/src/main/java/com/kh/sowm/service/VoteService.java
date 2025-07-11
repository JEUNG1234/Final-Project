package com.kh.sowm.service;

import com.kh.sowm.dto.PageResponse;
import com.kh.sowm.dto.VoteDto;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface VoteService {

    // 투표 생성
    Long createVote(VoteDto.CreateRequest createRequest, String userId);

    // 모든 투표 목록 조회 (페이징 적용)
    PageResponse<VoteDto.ListResponse> getAllVotes(String userId, Pageable pageable);

    // 투표 상세 결과 조회
    VoteDto.DetailResponse getVoteDetails(Long voteNo);

    // 투표하기
    void castVote(Long voteNo, Long voteContentNo, String userId);

    // 투표 삭제
    void deleteVote(Long voteNo, String userId);

    //  특정 항목의 투표자 목록 조회
    List<VoteDto.VoterResponse> getVotersForOption(Long voteContentNo);

    // [수정] 투표 응답률 통계 조회
    Map<String, Double> getVoteResponseRateStatistics(String companyCode);
}