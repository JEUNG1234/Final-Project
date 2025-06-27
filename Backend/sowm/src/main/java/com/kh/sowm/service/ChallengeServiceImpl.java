package com.kh.sowm.service;

import com.kh.sowm.dto.ChallengeDto;
import com.kh.sowm.entity.*;
import com.kh.sowm.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ChallengeServiceImpl implements ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;
    private final VoteRepository voteRepository;
    private final VoteContentRepository voteContentRepository;
    private final ChallengeCompleteRepository challengeCompleteRepository;
    private final ChallengeResultRepository challengeResultRepository;

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

    @Override
    @Transactional(readOnly = true)
    public ChallengeDto.DetailResponse findChallengeById(Long challengeNo) {
        Challenge challenge = challengeRepository.findById(challengeNo)
                .orElseThrow(() -> new EntityNotFoundException("챌린지를 찾을 수 없습니다: " + challengeNo));
        return ChallengeDto.DetailResponse.fromEntity(challenge);
    }

    @Override
    public Long createChallengeCompletion(Long challengeNo, ChallengeDto.CompletionRequest requestDto) {
        Optional<ChallengeComplete> activeCompletionOpt = challengeCompleteRepository.findActiveChallengeByUserId(requestDto.getUserId(), LocalDate.now());

        if (activeCompletionOpt.isPresent()) {
            ChallengeComplete activeCompletion = activeCompletionOpt.get();
            if (!activeCompletion.getChallenge().getChallengeNo().equals(challengeNo)) {
                throw new IllegalStateException("이미 진행중인 다른 챌린지가 있습니다. 종료 후 참여해주세요.");
            }
        }

        User user = userRepository.findByUserId(requestDto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + requestDto.getUserId()));

        Challenge challenge = challengeRepository.findById(challengeNo)
                .orElseThrow(() -> new EntityNotFoundException("챌린지를 찾을 수 없습니다: " + challengeNo));

        ChallengeComplete completion = ChallengeComplete.builder()
                .challenge(challenge)
                .user(user)
                .completeTitle(requestDto.getCompleteTitle())
                .completeContent(requestDto.getCompleteContent())
                .build();

        challengeCompleteRepository.save(completion);

        long completedCount = challenge.getCompletions().stream()
                .filter(c -> c.getUser().getUserId().equals(user.getUserId()))
                .count() + 1;

        long totalDuration = challenge.getChallengeEndDate().toEpochDay() - challenge.getChallengeStartDate().toEpochDay() + 1;

        int achievementRate = totalDuration > 0 ? (int) Math.round(((double) completedCount / totalDuration) * 100) : 0;

        boolean alreadySucceeded = challengeResultRepository.findByUserAndChallenge(user, challenge)
                .map(ChallengeResult::isSuccess)
                .orElse(false);

        if (achievementRate >= 70 && !alreadySucceeded) {
            user.addPoints(challenge.getChallengePoint());
            userRepository.save(user);

            ChallengeResult result = ChallengeResult.builder()
                    .user(user)
                    .challenge(challenge)
                    .success(true)
                    .finalAchievementRate(achievementRate)
                    .build();
            challengeResultRepository.save(result);
        }

        return completion.getCompleteNo();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasActiveChallenge(String userId) {
        return challengeCompleteRepository.findActiveChallengeByUserId(userId, LocalDate.now()).isPresent();
    }

    @Override
    @Transactional
    public Map<String, Object> findMyChallenges(String userId) {
        LocalDate today = LocalDate.now();
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        List<Challenge> allUserChallenges = challengeRepository.findAllByUserId(userId);

        for (Challenge challenge : allUserChallenges) {
            if (challenge.getChallengeEndDate().isBefore(today) &&
                    challengeResultRepository.findByUserAndChallenge(user, challenge).isEmpty()) {

                long totalDuration = challenge.getChallengeEndDate().toEpochDay() - challenge.getChallengeStartDate().toEpochDay() + 1;
                long completedCount = challenge.getCompletions().stream()
                        .filter(c -> c.getUser().getUserId().equals(userId))
                        .count();
                int achievementRate = totalDuration > 0 ? (int) Math.round(((double) completedCount / totalDuration) * 100) : 0;

                boolean isSuccess = achievementRate >= 70;

                ChallengeResult result = ChallengeResult.builder()
                        .user(user)
                        .challenge(challenge)
                        .success(isSuccess)
                        .finalAchievementRate(achievementRate)
                        .build();
                challengeResultRepository.save(result);
            }
        }

        Optional<Challenge> ongoingChallengeOpt = allUserChallenges.stream()
                .filter(c -> !c.getChallengeEndDate().isBefore(today))
                .findFirst();

        Map<String, Object> response = new HashMap<>();

        ongoingChallengeOpt.ifPresent(challenge -> {
            long totalDuration = challenge.getChallengeEndDate().toEpochDay() - challenge.getChallengeStartDate().toEpochDay() + 1;
            long completedCount = challenge.getCompletions().stream().filter(c -> c.getUser().getUserId().equals(userId)).count();
            int achievement = totalDuration > 0 ? (int) Math.round(((double) completedCount / totalDuration) * 100) : 0;

            Map<String, Object> ongoingChallengeData = new HashMap<>();
            ongoingChallengeData.put("challengeNo", challenge.getChallengeNo());
            ongoingChallengeData.put("challengeTitle", challenge.getChallengeTitle());
            ongoingChallengeData.put("challengeStartDate", challenge.getChallengeStartDate().toString());
            ongoingChallengeData.put("challengeEndDate", challenge.getChallengeEndDate().toString());
            ongoingChallengeData.put("challengeImageUrl", challenge.getChallengeImageUrl());
            ongoingChallengeData.put("achievement", achievement);
            ongoingChallengeData.put("currentProgressDays", completedCount);
            ongoingChallengeData.put("totalChallengeDays", totalDuration);

            response.put("ongoingChallenge", ongoingChallengeData);
        });

        if (ongoingChallengeOpt.isEmpty()) {
            response.put("ongoingChallenge", null);
        }

        response.put("completedChallenges", allUserChallenges.stream()
                .map(challenge -> ChallengeDto.MyChallengeResponse.fromEntity(challenge, userId))
                .collect(Collectors.toList()));

        response.put("userTotalPoints", user.getPoint());

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ChallengeDto.CompletionResponse> findCompletionsByChallenge(Long challengeNo, Pageable pageable) {
        Page<ChallengeComplete> completions = challengeCompleteRepository.findByChallenge_ChallengeNo(challengeNo, pageable);
        return completions.map(ChallengeDto.CompletionResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ChallengeDto.CompletionResponse> findMyCompletionsByChallenge(Long challengeNo, String userId, Pageable pageable) {
        Page<ChallengeComplete> completions = challengeCompleteRepository.findByChallenge_ChallengeNoAndUser_UserId(challengeNo, userId, pageable);
        return completions.map(ChallengeDto.CompletionResponse::fromEntity);
    }
}