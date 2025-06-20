package com.kh.sowm.service;

import com.kh.sowm.dto.VoteDto;
import java.util.List;

/**
 * 투표 관련 비즈니스 로직을 처리하는 서비스 인터페이스입니다.
 */
public interface VoteService {
    /**
     * 새로운 투표를 생성합니다.
     * @param createRequest 투표 생성에 필요한 데이터
     * @return 생성된 투표의 ID
     */
    Long createVote(VoteDto.CreateRequest createRequest);

    /**
     * 모든 투표 목록을 조회합니다.
     * @return 투표 목록
     */
    List<VoteDto.VoteListResponse> getAllVotes();

    /**
     * 특정 투표의 상세 정보를 조회합니다.
     * @param voteNo 조회할 투표의 ID
     * @return 투표 상세 정보
     */
    VoteDto.VoteDetailResponse getVoteDetails(Long voteNo);
}