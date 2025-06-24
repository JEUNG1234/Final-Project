package com.kh.sowm.service;

import com.kh.sowm.dto.VoteDto;

import java.util.List;

public interface VoteService {

    // 투표 생성
    Long createVote(VoteDto.CreateRequest createRequest, String userId);

    // 모든 투표 목록 조회
    List<VoteDto.ListResponse> getAllVotes(String userId);

    // 투표 상세 결과 조회
    VoteDto.DetailResponse getVoteDetails(Long voteNo);

    // 투표하기
    void castVote(Long voteNo, Long voteContentNo, String userId);

    // 투표 삭제
    void deleteVote(Long voteNo, String userId);

    //  특정 항목의 투표자 목록 조회
    List<VoteDto.VoterResponse> getVotersForOption(Long voteContentNo);
}