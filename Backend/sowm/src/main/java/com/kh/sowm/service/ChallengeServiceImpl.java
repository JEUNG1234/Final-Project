package com.kh.sowm.service;

import com.kh.sowm.dto.ChallengeDto;
import com.kh.sowm.dto.ChallengeDto.CompletionResponse;
import com.kh.sowm.entity.*;
import com.kh.sowm.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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
    private final ChallengeImageRepository challengeImageRepository; // 주입

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
                .challengeContent(requestDto.getChallengeContent())
                .user(adminUser)
                .vote(vote)
                .voteContent(voteContent)
                .challengeStartDate(requestDto.getChallengeStartDate())
                .challengeEndDate(requestDto.getChallengeEndDate())
                .challengePoint(requestDto.getChallengePoint())
                .pointsAwarded(false)
                .build();
        challengeRepository.save(challenge);

        // 이미지 정보가 있으면 ChallengeImage로 저장
        if (requestDto.getImage() != null) {
            ChallengeDto.ImageDto imageDto = requestDto.getImage();
            ChallengeImage challengeImage = ChallengeImage.builder()
                    .challenge(challenge)
                    .originalName(imageDto.getOriginalName())
                    .changedName(imageDto.getChangedName())
                    .path(imageDto.getPath())
                    .size(imageDto.getSize())
                    .build();
            challengeImageRepository.save(challengeImage);
        }

        return challenge.getChallengeNo();
    }


    @Override
    @Transactional(readOnly = true)
    public Page<ChallengeDto.ListResponse> findAllChallenges(Pageable pageable, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + userId));
        String companyCode = user.getCompanyCode();

        Page<Challenge> challengePage = challengeRepository.findAll(pageable, companyCode);
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

        // 이미지 정보가 있으면 ChallengeImage로 저장
        if (requestDto.getImage() != null) {
            ChallengeDto.ImageDto imageDto = requestDto.getImage();
            ChallengeImage challengeImage = ChallengeImage.builder()
                    .challengeComplete(completion)
                    .originalName(imageDto.getOriginalName())
                    .changedName(imageDto.getChangedName())
                    .path(imageDto.getPath())
                    .size(imageDto.getSize())
                    .build();
            challengeImageRepository.save(challengeImage);
        }

        // 인증글 작성 후 달성률 체크 및 포인트 지급 로직
        checkAndAwardPoints(challenge, user);

        return completion.getCompleteNo();
    }

    private void checkAndAwardPoints(Challenge challenge, User user) {
        // 이미 포인트가 지급되었거나 챌린지 기간이 아니면 중단
        if (challenge.isPointsAwarded() || LocalDate.now().isAfter(challenge.getChallengeEndDate())) {
            return;
        }

        long totalDuration = ChronoUnit.DAYS.between(challenge.getChallengeStartDate(), challenge.getChallengeEndDate()) + 1;
        long completedCount = challenge.getCompletions().stream()
                .filter(c -> c.getUser().getUserId().equals(user.getUserId()))
                .count();

        int achievementRate = totalDuration > 0 ? (int) Math.round(((double) completedCount / totalDuration) * 100) : 0;

        if (achievementRate >= 70) {
            user.addPoints(challenge.getChallengePoint());
            challenge.markAsPointsAwarded(); // 포인트 지급 상태로 변경
            // 변경된 user와 challenge 상태를 DB에 즉시 반영
            userRepository.save(user);
            challengeRepository.save(challenge);
        }
    }


    @Override
    @Transactional(readOnly = true)
    public boolean hasActiveChallenge(String userId) {
        return challengeCompleteRepository.findActiveChallengeByUserId(userId, LocalDate.now()).isPresent();
    }

    @Override
    @Transactional
    public Map<String, Object> findMyChallenges(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        List<Challenge> allUserChallenges = challengeRepository.findAllByUserId(userId);

        // 종료된 챌린지에 대한 최종 결과만 저장
        for (Challenge challenge : allUserChallenges) {
            if (challenge.getChallengeEndDate().isBefore(LocalDate.now()) &&
                    challengeResultRepository.findByUserAndChallenge(user, challenge).isEmpty()) {

                long totalDuration = ChronoUnit.DAYS.between(challenge.getChallengeStartDate(), challenge.getChallengeEndDate()) + 1;
                long completedCount = challenge.getCompletions().stream()
                        .filter(c -> c.getUser().getUserId().equals(userId))
                        .count();
                int achievementRate = totalDuration > 0 ? (int) Math.round(((double) completedCount / totalDuration) * 100) : 0;

                ChallengeResult result = ChallengeResult.builder()
                        .user(user)
                        .challenge(challenge)
                        .success(achievementRate >= 70)
                        .finalAchievementRate(achievementRate)
                        .build();
                challengeResultRepository.save(result);
            }
        }

        Optional<Challenge> ongoingChallengeOpt = allUserChallenges.stream()
                .filter(c -> !c.getChallengeEndDate().isBefore(LocalDate.now()))
                .findFirst();

        Map<String, Object> response = new HashMap<>();

        ongoingChallengeOpt.ifPresent(challenge -> {
            long totalDuration = ChronoUnit.DAYS.between(challenge.getChallengeStartDate(), challenge.getChallengeEndDate()) + 1;
            long completedCount = challenge.getCompletions().stream().filter(c -> c.getUser().getUserId().equals(userId)).count();
            int achievement = totalDuration > 0 ? (int) Math.round(((double) completedCount / totalDuration) * 100) : 0;

            String imageUrl = (challenge.getChallengeImages() != null && !challenge.getChallengeImages().isEmpty())
                    ? challenge.getChallengeImages().get(0).getPath()
                    : null;

            Map<String, Object> ongoingChallengeData = new HashMap<>();
            ongoingChallengeData.put("challengeNo", challenge.getChallengeNo());
            ongoingChallengeData.put("challengeTitle", challenge.getChallengeTitle());
            ongoingChallengeData.put("challengeStartDate", challenge.getChallengeStartDate().toString());
            ongoingChallengeData.put("challengeEndDate", challenge.getChallengeEndDate().toString());
            ongoingChallengeData.put("challengeImageUrl", imageUrl);
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

    @Override
    @Transactional(readOnly = true)
    public ChallengeDto.CompletionResponse getCompletionDetail(Long completionNo) {
        ChallengeComplete completion = challengeCompleteRepository.findById(completionNo)
                .orElseThrow(() -> new EntityNotFoundException("인증글을 찾을 수 없습니다: " + completionNo));
        return ChallengeDto.CompletionResponse.fromEntity(completion);
    }

    @Override
    public CompletionResponse getChallenge(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("계정 정보가 없습니다."));

        String companyCode = user.getCompanyCode();

        return challengeRepository.findDashBoardChallenge(companyCode)
                .map(CompletionResponse::from)
                .orElse(CompletionResponse.empty());
    }
}