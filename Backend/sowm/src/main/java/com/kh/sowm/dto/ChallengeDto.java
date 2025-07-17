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

    /**
     * 이미지 정보 DTO
     */
    @Getter
    @NoArgsConstructor
    public static class ImageDto {
        private String originalName; // 원본 파일명
        private String changedName;  // 변경된 파일명
        private String path;         // 파일 경로
        private Long size;           // 파일 크기
    }

    /**
     * 챌린지 생성 요청 DTO
     */
    @Getter
    @NoArgsConstructor
    public static class CreateRequest {
        private String userId;                // 작성자 ID
        private Long voteNo;                  // 관련 투표 번호
        private Long voteContentNo;           // 관련 투표 항목 번호
        private String challengeTitle;        // 챌린지 제목
        private String challengeContent;      // 챌린지 상세 설명
        private LocalDate challengeStartDate; // 챌린지 시작일
        private LocalDate challengeEndDate;   // 챌린지 종료일
        private int challengePoint;           // 보상 포인트
        private ImageDto image;               // 대표 이미지 정보
    }

    /**
     * 챌린지 인증(참여) 요청 DTO
     */
    @Getter
    @NoArgsConstructor
    public static class CompletionRequest {
        private String userId;          // 참여자 ID
        private String completeTitle;   // 인증글 제목
        private String completeContent; // 인증글 내용
        private ImageDto image;         // 인증 이미지 정보
    }

    /**
     * 챌린지 목록 조회 응답 DTO
     */
    @Getter
    @Builder
    public static class ListResponse {
        private Long challengeNo;             // 챌린지 번호
        private String challengeTitle;        // 챌린지 제목
        private String challengeImageUrl;     // 챌린지 대표 이미지 URL
        private LocalDate challengeStartDate; // 챌린지 시작일
        private LocalDate challengeEndDate;   // 챌린지 종료일
        private int challengePoint;           // 보상 포인트
        private int participantCount;         // 참여자 수

        public static ListResponse fromEntity(Challenge challenge) {
            String imageUrl = (challenge.getChallengeImages() != null && !challenge.getChallengeImages().isEmpty())
                    ? challenge.getChallengeImages().get(0).getChangedName()
                    : null;

            return ListResponse.builder()
                    .challengeNo(challenge.getChallengeNo())
                    .challengeTitle(challenge.getChallengeTitle())
                    .challengeImageUrl(imageUrl)
                    .challengeStartDate(challenge.getChallengeStartDate())
                    .challengeEndDate(challenge.getChallengeEndDate())
                    .challengePoint(challenge.getChallengePoint())
                    .participantCount(challenge.getParticipantCount())
                    .build();
        }
    }

    /**
     * 챌린지 인증글 응답 DTO
     */
    @Getter
    @Builder
    public static class CompletionResponse {
        private Long completeNo;          // 인증글 번호
        private String completeTitle;     // 인증글 제목
        private String completeContent;   // 인증글 내용
        private String userName;          // 작성자 이름
        private String userId;            // 작성자 ID
        private LocalDate createdDate;    // 작성일
        private LocalDate startDate;      // 챌린지 시작일 (대시보드용)
        private LocalDate endDate;        // 챌린지 종료일 (대시보드용)
        private String completeImageUrl;  // 인증 이미지 URL

        public static CompletionResponse fromEntity(ChallengeComplete completion) {
            String imageUrl = (completion.getChallengeImages() != null && !completion.getChallengeImages().isEmpty())
                    ? completion.getChallengeImages().get(0).getChangedName()
                    : null;

            return CompletionResponse.builder()
                    .completeNo(completion.getCompleteNo())
                    .completeTitle(completion.getCompleteTitle())
                    .completeContent(completion.getCompleteContent())
                    .userName(completion.getUser().getUserName())
                    .userId(completion.getUser().getUserId())
                    .createdDate(completion.getCreatedDate())
                    .completeImageUrl(imageUrl)
                    .build();
        }

        public static CompletionResponse from(Challenge challenge) {
            String imageUrl = (challenge.getChallengeImages() != null && !challenge.getChallengeImages().isEmpty())
                    ? challenge.getChallengeImages().get(0).getChangedName()
                    : null;

            return CompletionResponse.builder()
                    .completeNo(challenge.getChallengeNo())
                    .completeTitle(challenge.getChallengeTitle())
                    .createdDate(challenge.getChallengeEndDate())
                    .startDate(challenge.getChallengeStartDate())
                    .endDate(challenge.getChallengeEndDate())
                    .completeImageUrl(imageUrl)
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

    /**
     * 챌린지 상세 정보 응답 DTO
     */
    @Getter
    @Builder
    public static class DetailResponse {
        private Long challengeNo;             // 챌린지 번호
        private String challengeTitle;        // 챌린지 제목
        private String challengeContent;      // 챌린지 상세 설명
        private String challengeImageUrl;     // 챌린지 대표 이미지 URL
        private LocalDate challengeStartDate; // 챌린지 시작일
        private LocalDate challengeEndDate;   // 챌린지 종료일
        private int challengePoint;           // 보상 포인트
        private int participantCount;         // 참여자 수
        private List<CompletionResponse> completions; // 인증글 목록

        public static DetailResponse fromEntity(Challenge challenge) {
            String imageUrl = (challenge.getChallengeImages() != null && !challenge.getChallengeImages().isEmpty())
                    ? challenge.getChallengeImages().get(0).getChangedName()
                    : null;

            return DetailResponse.builder()
                    .challengeNo(challenge.getChallengeNo())
                    .challengeTitle(challenge.getChallengeTitle())
                    .challengeContent(challenge.getChallengeContent())
                    .challengeImageUrl(imageUrl)
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

    /**
     * 나의 챌린지 정보 응답 DTO
     */
    @Getter
    @Builder
    public static class MyChallengeResponse {
        private Long challengeNo;             // 챌린지 번호
        private String challengeTitle;        // 챌린지 제목
        private String challengeImageUrl;     // 챌린지 대표 이미지 URL
        private LocalDate challengeStartDate; // 챌린지 시작일
        private LocalDate challengeEndDate;   // 챌린지 종료일
        private int challengePoint;           // 보상 포인트
        private int userAchievementRate;      // 사용자 달성률

        public static MyChallengeResponse fromEntity(Challenge challenge, String userId) {
            long totalDuration = challenge.getChallengeEndDate().toEpochDay() - challenge.getChallengeStartDate().toEpochDay() + 1;
            long completedCount = challenge.getCompletions().stream()
                    .filter(c -> c.getUser().getUserId().equals(userId))
                    .count();
            int achievement = totalDuration > 0 ? (int) Math.round(((double) completedCount / totalDuration) * 100) : 0;

            String imageUrl = (challenge.getChallengeImages() != null && !challenge.getChallengeImages().isEmpty())
                    ? challenge.getChallengeImages().get(0).getChangedName()
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