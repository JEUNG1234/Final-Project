package com.kh.sowm.repository;

import com.kh.sowm.entity.Challenge;
import com.kh.sowm.entity.Vote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ChallengeRepository {

    // 챌린지 저장
    void save(Challenge challenge);

    // 투표 정보로 챌린지 조회
    Optional<Challenge> findByVote(Vote vote);

    // 챌린지 삭제
    void delete(Challenge challenge);

    // 모든 챌린지 목록 조회 (페이징 처리, 회사 코드로 필터링)
    Page<Challenge> findAll(Pageable pageable, String companyCode);

    // 챌린지 ID로 상세 정보 조회
    Optional<Challenge> findById(Long challengeNo);

    // 특정 사용자의 완료된 챌린지 목록 조회
    List<Challenge> findCompletedChallengesByUserId(String userId, LocalDate today);

    // 특정 사용자가 참여한 모든 챌린지 목록 조회
    List<Challenge> findAllByUserId(String userId);

    // 대시보드에 표시할 최신 챌린지 정보 조회
    Optional<Challenge> findDashBoardChallenge(String companyCode);
}