package com.kh.sowm.service;

import com.kh.sowm.dto.VoteDto;
import com.kh.sowm.entity.User;
import com.kh.sowm.entity.Vote;
import com.kh.sowm.entity.VoteContent;
import com.kh.sowm.entity.VoteUser;
import com.kh.sowm.repository.UserRepository;
import com.kh.sowm.repository.VoteContentRepository;
import com.kh.sowm.repository.VoteRepository;
import com.kh.sowm.repository.VoteUserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VoteServiceImpl implements VoteService {

    private final VoteRepository voteRepository;
    private final VoteContentRepository voteContentRepository;
    private final UserRepository userRepository;
    private final VoteUserRepository voteUserRepository;

    // createVote, getAllVotes, getVoteDetails 메서드는 변경 없습니다.
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
        List<Vote> votes = voteRepository.findAll();
        Set<Long> votedVoteNos = voteUserRepository.findVotedVoteNosByUserId(userId);

        return votes.stream()
                .map(vote -> {
                    boolean isVoted = votedVoteNos.contains(vote.getVoteNo());
                    return VoteDto.ListResponse.fromEntity(vote, isVoted);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public VoteDto.DetailResponse getVoteDetails(Long voteNo) {
        Vote vote = voteRepository.findById(voteNo)
                .orElseThrow(() -> new EntityNotFoundException("투표를 찾을 수 없습니다: " + voteNo));
        return VoteDto.DetailResponse.fromEntity(vote);
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
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }

        Vote vote = voteRepository.findById(voteNo)
                .orElseThrow(() -> new EntityNotFoundException("투표를 찾을 수 없습니다: " + voteNo));
        voteRepository.delete(vote);
    }
}