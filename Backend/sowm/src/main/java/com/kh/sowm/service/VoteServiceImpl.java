package com.kh.sowm.service;

import com.kh.sowm.dto.VoteDto;
import com.kh.sowm.entity.Challenge;
import com.kh.sowm.entity.User;
import com.kh.sowm.entity.Vote;
import com.kh.sowm.entity.VoteContent;
import com.kh.sowm.entity.VoteUser;
import com.kh.sowm.exception.ErrorCode;
import com.kh.sowm.exception.usersException.CompanyNotFoundException;
import com.kh.sowm.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VoteServiceImpl implements VoteService {

    private final VoteRepository voteRepository;
    private final VoteContentRepository voteContentRepository;
    private final UserRepository userRepository;
    private final VoteUserRepository voteUserRepository;
    private final ChallengeRepository challengeRepository;

    @Override
    public Long createVote(VoteDto.CreateRequest createRequest, String userId) {
        User writer = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        Vote vote = createRequest.toVoteEntity(writer);
        voteRepository.save(vote);

        List<VoteContent> contents = createRequest.getOptions().stream()
                .map(optionText -> VoteContent.builder()
                        .vote(vote)
                        .voteContent(optionText)
                        .build())
                .collect(Collectors.toList());

        voteContentRepository.saveAll(contents);

        return vote.getVoteNo();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VoteDto.ListResponse> getAllVotes(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + userId));
        String companyCode = user.getCompanyCode();

        List<Vote> votes = voteRepository.findAll(companyCode);

        Map<Long, Long> userVoteMap = voteUserRepository.findVoteUsersByUserId(userId).stream()
                .collect(Collectors.toMap(
                        voteUser -> voteUser.getVote().getVoteNo(),
                        voteUser -> voteUser.getVoteContent().getVoteContentNo()
                ));

        return votes.stream()
                .map(vote -> {
                    Long votedOptionNo = userVoteMap.get(vote.getVoteNo());
                    return VoteDto.ListResponse.fromEntity(vote, votedOptionNo);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public VoteDto.DetailResponse getVoteDetails(Long voteNo) {
        Vote vote = voteRepository.findById(voteNo)
                .orElseThrow(() -> new EntityNotFoundException("투표를 찾을 수 없습니다: " + voteNo));

        boolean isChallengeCreated = challengeRepository.findByVote(vote).isPresent();
        System.out.println("✅ [DEBUG] VoteService - 투표번호 " + voteNo + "의 챌린지 생성 여부: " + isChallengeCreated);

        return VoteDto.DetailResponse.fromEntity(vote, isChallengeCreated);
    }

    @Override
    public void castVote(Long voteNo, Long voteContentNo, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        VoteContent voteContent = voteContentRepository.findById(voteContentNo)
                .orElseThrow(() -> new EntityNotFoundException("투표 항목을 찾을 수 없습니다: " + voteContentNo));

        Vote vote = voteContent.getVote();

        if (!vote.getVoteNo().equals(voteNo)) {
            throw new IllegalArgumentException("투표와 투표 항목이 일치하지 않습니다.");
        }
        if (vote.getVoteEndDate().isBefore(LocalDate.now())) {
            throw new IllegalStateException("이미 종료된 투표입니다.");
        }
        if (voteUserRepository.existsByVoteNoAndUserId(voteNo, userId)) {
            throw new IllegalStateException("이미 투표에 참여했습니다.");
        }

        vote.incrementTotalVotes();
        voteContent.incrementVoteCount();

        VoteUser voteUser = VoteUser.builder()
                .user(user)
                .vote(vote)
                .voteContent(voteContent)
                .build();

        vote.addVoteUser(voteUser);

        voteRepository.save(vote);
    }

    @Override
    public void deleteVote(Long voteNo, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        if (!"J2".equals(user.getJob().getJobCode())) {
            throw new CompanyNotFoundException(ErrorCode.VOTE_CANNOT_BE_DELETED);
        }

        Vote vote = voteRepository.findById(voteNo)
                .orElseThrow(() -> new EntityNotFoundException("투표를 찾을 수 없습니다: " + voteNo));

        Optional<Challenge> challengeOpt = challengeRepository.findByVote(vote);
        boolean isVoteFinished = vote.getVoteEndDate().isBefore(LocalDate.now());

        if (isVoteFinished && challengeOpt.isPresent()) {
            Challenge challenge = challengeOpt.get();
            if (challenge.getParticipantCount() > 0) {
                throw new CompanyNotFoundException(ErrorCode.VOTE_CANNOT_BE_DELETED);
            }
        }

        challengeOpt.ifPresent(challenge -> {
            challengeRepository.delete(challenge);
        });

        voteRepository.delete(vote);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VoteDto.VoterResponse> getVotersForOption(Long voteContentNo) {
        List<User> voters = voteUserRepository.findVotersByVoteContentNo(voteContentNo);
        return voters.stream()
                .map(VoteDto.VoterResponse::fromEntity)
                .collect(Collectors.toList());
    }
}