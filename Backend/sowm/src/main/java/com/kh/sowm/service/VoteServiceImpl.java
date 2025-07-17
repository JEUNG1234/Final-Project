package com.kh.sowm.service;

import com.kh.sowm.dto.PageResponse;
import com.kh.sowm.dto.VoteDto;
import com.kh.sowm.entity.*;
import com.kh.sowm.exception.ErrorCode;
import com.kh.sowm.exception.usersException.CompanyNotFoundException;
import com.kh.sowm.exception.voteException.VotePermissionException; // 새로운 예외 클래스 임포트
import com.kh.sowm.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashMap;
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
    public PageResponse<VoteDto.ListResponse> getAllVotes(String userId, Pageable pageable) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + userId));
        String companyCode = user.getCompanyCode();

        Page<Vote> votesPage = voteRepository.findAll(companyCode, pageable);

        Map<Long, Long> userVoteMap = voteUserRepository.findVoteUsersByUserId(userId).stream()
                .collect(Collectors.toMap(
                        voteUser -> voteUser.getVote().getVoteNo(),
                        voteUser -> voteUser.getVoteContent().getVoteContentNo()
                ));

        Page<VoteDto.ListResponse> dtoPage = votesPage.map(vote -> {
            Long votedOptionNo = userVoteMap.get(vote.getVoteNo());
            return VoteDto.ListResponse.fromEntity(vote, votedOptionNo);
        });

        return new PageResponse<>(dtoPage);
    }

    @Override
    @Transactional(readOnly = true)
    public VoteDto.DetailResponse getVoteDetails(Long voteNo) {
        Vote vote = voteRepository.findById(voteNo)
                .orElseThrow(() -> new EntityNotFoundException("투표를 찾을 수 없습니다: " + voteNo));

        boolean isChallengeCreated = challengeRepository.findByVote(vote).isPresent();
        System.out.println("[DEBUG] VoteService - 투표번호 " + voteNo + "의 챌린지 생성 여부: " + isChallengeCreated);

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
            throw new VotePermissionException();
        }

        Vote vote = voteRepository.findById(voteNo)
                .orElseThrow(() -> new EntityNotFoundException("투표를 찾을 수 없습니다: " + voteNo));

        Optional<Challenge> challengeOpt = challengeRepository.findByVote(vote);

        if (challengeOpt.isPresent()) {
            Challenge challenge = challengeOpt.get();
            if (challenge.getParticipantCount() > 0) {
                throw new IllegalStateException("이미 챌린지 참여자가 있어 삭제가 불가능합니다.");
            }
            challengeRepository.delete(challenge);
        }

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
    @Override
    @Transactional(readOnly = true)
    public Map<String, Double> getVoteResponseRateStatistics(String companyCode) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate startOfMonth = today.withDayOfMonth(1);

        long totalUsers = voteRepository.countTotalUsersByCompanyCode(companyCode);

        if (totalUsers == 0) {
            return Map.of("daily", 0.0, "weekly", 0.0, "monthly", 0.0);
        }

        long dailyVoters = voteRepository.countUniqueVotersByCompanyCodeInPeriod(companyCode, today, today);
        long weeklyVoters = voteRepository.countUniqueVotersByCompanyCodeInPeriod(companyCode, startOfWeek, today);
        long monthlyVoters = voteRepository.countUniqueVotersByCompanyCodeInPeriod(companyCode, startOfMonth, today);

        Map<String, Double> stats = new HashMap<>();
        stats.put("daily", (double) dailyVoters / totalUsers * 100);
        stats.put("weekly", (double) weeklyVoters / totalUsers * 100);
        stats.put("monthly", (double) monthlyVoters / totalUsers * 100);

        return stats;
    }
}