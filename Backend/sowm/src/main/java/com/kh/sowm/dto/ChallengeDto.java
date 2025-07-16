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

    // 이미지 정보를 담을 DTO 클래스 추가
    @Getter
    @NoArgsConstructor
    public static class ImageDto {
        private String originalName;
        private String changedName;
        private String path;
        private Long size;
    }

    @Getter
    @NoArgsConstructor
    public static class CreateRequest {
        private String userId;
        private Long voteNo;
        private Long voteContentNo;
        private String challengeTitle;
        private String challengeContent; // 상세 설명 필드 추가
        private LocalDate challengeStartDate;
        private LocalDate challengeEndDate;
        private int challengePoint;
        private ImageDto image; // String -> ImageDto로 변경
    }

    @Getter
    @NoArgsConstructor
    public static class CompletionRequest {
        private String userId;
        private String completeTitle;
        private String completeContent;
        private ImageDto image; // String -> ImageDto로 변경
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
            // 챌린지 이미지 리스트에서 첫 번째 이미지의 경로를 가져옴
            String imageUrl = (challenge.getChallengeImages() != null && !challenge.getChallengeImages().isEmpty())
                    ? challenge.getChallengeImages().get(0).getPath()
                    : null;

            return ListResponse.builder()
                    .challengeNo(challenge.getChallengeNo())
                    .challengeTitle(challenge.getChallengeTitle())
                    .challengeImageUrl(imageUrl) // 수정된 이미지 URL
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
        private LocalDate startDate;
        private LocalDate endDate;
        private String completeImageUrl;

        public static CompletionResponse fromEntity(ChallengeComplete completion) {
            // 인증글 이미지 리스트에서 첫 번째 이미지의 경로를 가져옴
            String imageUrl = (completion.getChallengeImages() != null && !completion.getChallengeImages().isEmpty())
                    ? completion.getChallengeImages().get(0).getPath()
                    : null;

            return CompletionResponse.builder()
                    .completeNo(completion.getCompleteNo())
                    .completeTitle(completion.getCompleteTitle())
                    .completeContent(completion.getCompleteContent())
                    .userName(completion.getUser().getUserName())
                    .userId(completion.getUser().getUserId())
                    .createdDate(completion.getCreatedDate())
                    .completeImageUrl(imageUrl) // 수정된 이미지 URL
                    .build();
        }

        public static CompletionResponse from(Challenge challenge) {
            return CompletionResponse.builder()
                    .completeNo(challenge.getChallengeNo())
                    .completeTitle(challenge.getChallengeTitle())
                    .createdDate(challenge.getChallengeEndDate())
                    .startDate(challenge.getChallengeStartDate())
                    .endDate(challenge.getChallengeEndDate())
                    .build();
        }
        public static CompletionResponse empty() {
            return CompletionResponse.builder()
                    .completeNo(null)
                    .completeTitle(null)
                    .completeContent(null)
                    .userName(null)
                    .userId(null)
                    .createdDate(null)
                    .startDate(null)
                    .endDate(null)
                    .completeImageUrl(null)
                    .build();
        }
    }

    @Getter
    @Builder
    public static class DetailResponse {
        private Long challengeNo;
        private String challengeTitle;
        private String challengeContent;
        private String challengeImageUrl;
        private LocalDate challengeStartDate;
        private LocalDate challengeEndDate;
        private int challengePoint;
        private int participantCount;
        private List<CompletionResponse> completions;

        public static DetailResponse fromEntity(Challenge challenge) {
            // 챌린지 이미지 리스트에서 첫 번째 이미지의 경로를 가져옴
            String imageUrl = (challenge.getChallengeImages() != null && !challenge.getChallengeImages().isEmpty())
                    ? challenge.getChallengeImages().get(0).getPath()
                    : null;

            return DetailResponse.builder()
                    .challengeNo(challenge.getChallengeNo())
                    .challengeTitle(challenge.getChallengeTitle())
                    .challengeContent(challenge.getChallengeContent())
                    .challengeImageUrl(imageUrl) // 수정된 이미지 URL
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
        private int userAchievementRate;

        public static MyChallengeResponse fromEntity(Challenge challenge, String userId) {
            long totalDuration = challenge.getChallengeEndDate().toEpochDay() - challenge.getChallengeStartDate().toEpochDay() + 1;
            long completedCount = challenge.getCompletions().stream()
                    .filter(c -> c.getUser().getUserId().equals(userId))
                    .count();
            int achievement = totalDuration > 0 ? (int) Math.round(((double) completedCount / totalDuration) * 100) : 0;

            String imageUrl = (challenge.getChallengeImages() != null && !challenge.getChallengeImages().isEmpty())
                    ? challenge.getChallengeImages().get(0).getPath()
                    : null;

            return MyChallengeResponse.builder()
                    .challengeNo(challenge.getChallengeNo())
                    .challengeTitle(challenge.getChallengeTitle())
                    .challengeImageUrl(imageUrl)
                    .challengeStartDate(challenge.getChallengeStartDate())
                    .challengeEndDate(challenge.getChallengeEndDate())
                    .challengePoint(challenge.getChallengePoint())
                    .userAchievementRate(achievement)
                    .build();
        }
    }
}