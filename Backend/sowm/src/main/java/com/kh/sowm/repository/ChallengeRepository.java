package com.kh.sowm.repository;

import com.kh.sowm.entity.Challenge;
import com.kh.sowm.entity.Vote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ChallengeRepository {

    void save(Challenge challenge);

    Optional<Challenge> findByVote(Vote vote);

    void delete(Challenge challenge);

    Page<Challenge> findAll(Pageable pageable);

    Optional<Challenge> findById(Long challengeNo);

    List<Challenge> findCompletedChallengesByUserId(String userId, LocalDate today);

    // 사용자가 참여한 모든 챌린지 목록 조회를 위한 메소드 추가
    List<Challenge> findAllByUserId(String userId);

    Optional<Challenge> findDashBoardChallenge(String companyCode);
}