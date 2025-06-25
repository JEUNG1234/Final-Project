package com.kh.sowm.service;

import com.kh.sowm.dto.ChallengeDto;
import com.kh.sowm.entity.Challenge;
import com.kh.sowm.entity.User;
import com.kh.sowm.entity.Vote;
import com.kh.sowm.entity.VoteContent;
import com.kh.sowm.repository.ChallengeRepository;
import com.kh.sowm.repository.UserRepository;
import com.kh.sowm.repository.VoteContentRepository;
import com.kh.sowm.repository.VoteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ChallengeServiceImpl implements ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;
    private final VoteRepository voteRepository;
    private final VoteContentRepository voteContentRepository;

    @Override
    public Long createChallenge(ChallengeDto.CreateRequest requestDto) {
        // 1. 엔티티 조회
        User adminUser = userRepository.findByUserId(requestDto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("관리자 정보를 찾을 수 없습니다."));

        Vote vote = voteRepository.findById(requestDto.getVoteNo())
                .orElseThrow(() -> new EntityNotFoundException("원본 투표를 찾을 수 없습니다."));

        VoteContent voteContent = voteContentRepository.findById(requestDto.getVoteContentNo())
                .orElseThrow(() -> new EntityNotFoundException("원본 투표 항목을 찾을 수 없습니다."));

        // 2. 챌린지 엔티티 생성
        Challenge challenge = Challenge.builder()
                .challengeTitle(requestDto.getChallengeTitle())
                .user(adminUser)
                .vote(vote)
                .voteContent(voteContent)
                .challengeStartDate(requestDto.getChallengeStartDate())
                .challengeEndDate(requestDto.getChallengeEndDate())
                .challengePoint(requestDto.getChallengePoint())
                .build();

        // 3. 챌린지 저장
        challengeRepository.save(challenge);

        return challenge.getChallengeNo();
    }
}