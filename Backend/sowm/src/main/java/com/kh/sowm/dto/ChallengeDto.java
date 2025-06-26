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

        public static CompletionResponse fromEntity(ChallengeComplete completion) {
            return CompletionResponse.builder()
                    .completeNo(completion.getCompleteNo())
                    .completeTitle(completion.getCompleteTitle())
                    .completeContent(completion.getCompleteContent())
                    .userName(completion.getUser().getUserName())
                    .userId(completion.getUser().getUserId())
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
}