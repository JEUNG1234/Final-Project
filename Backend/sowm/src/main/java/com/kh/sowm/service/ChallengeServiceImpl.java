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

    @Override
    @Transactional(readOnly = true)
    public Page<ChallengeDto.ListResponse> findAllChallenges(Pageable pageable) {
        Page<Challenge> challengePage = challengeRepository.findAll(pageable);
        return challengePage.map(ChallengeDto.ListResponse::fromEntity);
    }

    /**
     * ID로 챌린지를 조회하고 DTO로 변환하여 반환
     * @param challengeNo 조회할 챌린지 ID
     * @return 챌린지 상세 DTO
     */
    @Override
    @Transactional(readOnly = true)
    public ChallengeDto.DetailResponse findChallengeById(Long challengeNo) {
        Challenge challenge = challengeRepository.findById(challengeNo)
                .orElseThrow(() -> new EntityNotFoundException("챌린지를 찾을 수 없습니다: " + challengeNo));
        return ChallengeDto.DetailResponse.fromEntity(challenge);
    }
}