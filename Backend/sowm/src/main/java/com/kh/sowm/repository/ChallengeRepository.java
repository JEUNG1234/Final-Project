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

    // Pageable을 받도록 수정
    Page<Challenge> findAll(Pageable pageable);
}