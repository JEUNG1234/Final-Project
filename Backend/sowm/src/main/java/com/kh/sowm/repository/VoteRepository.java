package com.kh.sowm.repository;

import com.kh.sowm.entity.Vote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.Optional;

public interface VoteRepository {

    // 투표 저장 또는 수정
    Vote save(Vote vote);

    // 모든 투표 조회 (회사 코드로 필터링) - 페이징 기능 추가
    Page<Vote> findAll(String companyCode, Pageable pageable);

    // ID로 투표 조회
    Optional<Vote> findById(Long voteNo);

    // 투표 삭제
    void delete(Vote vote);

    // 특정 투표에 연결된 모든 VoteUser 기록을 삭제하는 메서드 추가
    void deleteVoteUsersByVote(Vote vote);

    // 특정 기간 내에 투표한 유니크한 사용자 수 조회
    long countUniqueVotersByCompanyCodeInPeriod(String companyCode, LocalDate startDate, LocalDate endDate);

    // 회사 코드에 해당하는 전체 사용자 수 조회
    long countTotalUsersByCompanyCode(String companyCode);
}