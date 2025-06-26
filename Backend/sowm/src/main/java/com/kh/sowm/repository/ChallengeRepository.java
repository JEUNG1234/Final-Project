package com.kh.sowm.repository;

import com.kh.sowm.entity.Challenge;
import com.kh.sowm.entity.Vote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ChallengeRepository {

    void save(Challenge challenge);

    Optional<Challenge> findByVote(Vote vote);

    void delete(Challenge challenge);

    Page<Challenge> findAll(Pageable pageable);

    // ID로 챌린지 조회를 위한 메소드 추가
    Optional<Challenge> findById(Long challengeNo);
}