package com.kh.sowm.dto;

import com.kh.sowm.entity.Challenge;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

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
        private int participantCount; // 참여자 수 필드 추가

        public static ListResponse fromEntity(Challenge challenge) {
            return ListResponse.builder()
                    .challengeNo(challenge.getChallengeNo())
                    .challengeTitle(challenge.getChallengeTitle())
                    .challengeImageUrl(challenge.getChallengeImageUrl())
                    .challengeStartDate(challenge.getChallengeStartDate())
                    .challengeEndDate(challenge.getChallengeEndDate())
                    .challengePoint(challenge.getChallengePoint())
                    .participantCount(challenge.getParticipantCount()) // Formula 필드 값 매핑
                    .build();
        }
    }
}