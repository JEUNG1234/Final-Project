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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        // ... (기존 생성 로직 동일)
        User adminUser = userRepository.findByUserId(requestDto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("관리자 정보를 찾을 수 없습니다."));

        Vote vote = voteRepository.findById(requestDto.getVoteNo())
                .orElseThrow(() -> new EntityNotFoundException("원본 투표를 찾을 수 없습니다."));

        VoteContent voteContent = voteContentRepository.findById(requestDto.getVoteContentNo())
                .orElseThrow(() -> new EntityNotFoundException("원본 투표 항목을 찾을 수 없습니다."));

        Challenge challenge = Challenge.builder()
                .challengeTitle(requestDto.getChallengeTitle())
                .user(adminUser)
                .vote(vote)
                .voteContent(voteContent)
                .challengeImageUrl(requestDto.getChallengeImageUrl())
                .challengeStartDate(requestDto.getChallengeStartDate())
                .challengeEndDate(requestDto.getChallengeEndDate())
                .challengePoint(requestDto.getChallengePoint())
                .build();

        challengeRepository.save(challenge);

        return challenge.getChallengeNo();
    }

    /**
     * 페이징 처리된 모든 챌린지를 조회하여 DTO 페이지로 반환
     * @param pageable 페이징 정보
     * @return 챌린지 목록 DTO 페이지 객체
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ChallengeDto.ListResponse> findAllChallenges(Pageable pageable) {
        Page<Challenge> challengePage = challengeRepository.findAll(pageable);
        return challengePage.map(ChallengeDto.ListResponse::fromEntity);
    }
}