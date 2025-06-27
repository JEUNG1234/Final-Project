package com.kh.sowm.dto;

import com.kh.sowm.entity.Challenge;
import com.kh.sowm.entity.ChallengeComplete;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class ChallengeDto {

    @Getter
    @NoArgsConstructor
    public static class CreateRequest {
        private String userId;
        private Long voteNo;
        private Long voteContentNo;
        private String challengeTitle;
        private LocalDate challengeStartDate;
        private LocalDate challengeEndDate;
        private int challengePoint;
        private String challengeImageUrl;
    }

    @Getter
    @NoArgsConstructor
    public static class CompletionRequest {
        private String userId;
        private String completeTitle;
        private String completeContent;
        private String completeImageUrl; // 💡 인증 이미지 URL 필드 추가
    }

    @Getter
    @Builder
    public static class ListResponse {
        private Long challengeNo;
        private String challengeTitle;
        private String challengeImageUrl;
        private LocalDate challengeStartDate;
        private LocalDate challengeEndDate;
        private int challengePoint;
        private int participantCount;

        public static ListResponse fromEntity(Challenge challenge) {
            return ListResponse.builder()
                    .challengeNo(challenge.getChallengeNo())
                    .challengeTitle(challenge.getChallengeTitle())
                    .challengeImageUrl(challenge.getChallengeImageUrl())
                    .challengeStartDate(challenge.getChallengeStartDate())
                    .challengeEndDate(challenge.getChallengeEndDate())
                    .challengePoint(challenge.getChallengePoint())
                    .participantCount(challenge.getParticipantCount())
                    .build();
        }
    }

    @Getter
    @Builder
    public static class CompletionResponse {
        private Long completeNo;
        private String completeTitle;
        private String completeContent;
        private String userName;
        private String userId;
        private LocalDate createdDate;
        private String completeImageUrl; //  인증 이미지 URL 필드 추가

        public static CompletionResponse fromEntity(ChallengeComplete completion) {
            return CompletionResponse.builder()
                    .completeNo(completion.getCompleteNo())
                    .completeTitle(completion.getCompleteTitle())
                    .completeContent(completion.getCompleteContent())
                    .userName(completion.getUser().getUserName())
                    .userId(completion.getUser().getUserId())
                    .createdDate(completion.getCreatedDate())
                    .completeImageUrl(completion.getCompleteImageUrl()) //  필드 매핑
                    .build();
        }
    }

    @Getter
    @Builder
    public static class DetailResponse {
        private Long challengeNo;
        private String challengeTitle;
        private String challengeImageUrl;
        private LocalDate challengeStartDate;
        private LocalDate challengeEndDate;
        private int challengePoint;
        private int participantCount;
        private List<CompletionResponse> completions;

        public static DetailResponse fromEntity(Challenge challenge) {
            return DetailResponse.builder()
                    .challengeNo(challenge.getChallengeNo())
                    .challengeTitle(challenge.getChallengeTitle())
                    .challengeImageUrl(challenge.getChallengeImageUrl())
                    .challengeStartDate(challenge.getChallengeStartDate())
                    .challengeEndDate(challenge.getChallengeEndDate())
                    .challengePoint(challenge.getChallengePoint())
                    .participantCount(challenge.getParticipantCount())
                    .completions(challenge.getCompletions().stream()
                            .map(CompletionResponse::fromEntity)
                            .collect(Collectors.toList()))
                    .build();
        }
    }

    @Getter
    @Builder
    public static class MyChallengeResponse {
        private Long challengeNo;
        private String challengeTitle;
        private String challengeImageUrl;
        private LocalDate challengeStartDate;
        private LocalDate challengeEndDate;
        private int challengePoint;
        private int userAchievementRate; // 개인 달성률

        public static MyChallengeResponse fromEntity(Challenge challenge, String userId) {
            long totalDuration = challenge.getChallengeEndDate().toEpochDay() - challenge.getChallengeStartDate().toEpochDay() + 1;
            long completedCount = challenge.getCompletions().stream()
                    .filter(c -> c.getUser().getUserId().equals(userId))
                    .count();
            int achievement = totalDuration > 0 ? (int) Math.round(((double) completedCount / totalDuration) * 100) : 0;

            return MyChallengeResponse.builder()
                    .challengeNo(challenge.getChallengeNo())
                    .challengeTitle(challenge.getChallengeTitle())
                    .challengeImageUrl(challenge.getChallengeImageUrl())
                    .challengeStartDate(challenge.getChallengeStartDate())
                    .challengeEndDate(challenge.getChallengeEndDate())
                    .challengePoint(challenge.getChallengePoint())
                    .userAchievementRate(achievement)
                    .build();
        }
    }
}