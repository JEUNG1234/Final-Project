package com.kh.sowm.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.sowm.entity.User;
import com.kh.sowm.entity.Vote;
import com.kh.sowm.entity.VoteContent;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class VoteDto {

    @Getter
    @Builder
    public static class VoterResponse {
        private String userId;
        private String userName;

        public static VoterResponse fromEntity(User user) {
            return VoterResponse.builder()
                    .userId(user.getUserId())
                    .userName(user.getUserName())
                    .build();
        }
    }

    /**
     * 투표 생성을 위한 요청 DTO
     * 프론트엔드에서 userId를 포함하여 전송합니다.
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String voteTitle;
        private String voteType;
        private LocalDate voteEndDate;
        private List<String> options;
        private String userId;
        private boolean anonymous;
        private Integer points;

        public Vote toVoteEntity(User writer) {
            return Vote.builder()
                    .voteTitle(this.voteTitle)
                    .voteType(Vote.Type.valueOf(this.voteType.toUpperCase()))
                    .voteEndDate(this.voteEndDate)
                    .writer(writer)
                    .anonymous(this.anonymous)
                    .points(this.points)
                    .companyCode(writer.getCompanyCode()) // 작성자의 회사 코드 설정
                    .build();
        }
    }


    /**
     * 투표하기 요청 DTO
     * 프론트엔드에서 userId를 포함하여 전송합니다.
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CastRequest {
        private Long voteContentNo; // 사용자가 선택한 항목의 ID
        private String userId;      // 투표를 하는 사용자의 ID
    }

    /**
     * 투표 목록 조회를 위한 응답 DTO
     */
    @Getter
    @Builder
    public static class ListResponse {
        private Long voteNo;
        private String voteTitle;
        private String voteType;
        private LocalDate voteEndDate;
        private int totalVotes;
        private Integer points;

        private Long votedOptionNo; // 사용자가 투표한 항목 ID, 없으면 null

        @JsonProperty("isAnonymous")
        private boolean isAnonymous;

        private List<OptionResponse> options;

        public static ListResponse fromEntity(Vote vote, Long votedOptionNo) {
            return ListResponse.builder()
                    .voteNo(vote.getVoteNo())
                    .voteTitle(vote.getVoteTitle())
                    .voteType(vote.getVoteType().name())
                    .voteEndDate(vote.getVoteEndDate())
                    .totalVotes(vote.getTotalVotes())
                    .points(vote.getPoints())
                    .votedOptionNo(votedOptionNo)
                    .isAnonymous(vote.isAnonymous())
                    .options(vote.getVoteContents().stream()
                            .map(OptionResponse::fromEntity)
                            .collect(Collectors.toList()))
                    .build();
        }
    }

    /**
     * 투표 결과 상세 조회를 위한 응답 DTO
     */
    @Getter
    @Builder
    public static class DetailResponse {
        private Long voteNo;
        private String voteTitle;
        private String voteType;
        private LocalDate voteEndDate;
        private int totalVotes;
        private Integer points;
        private boolean isChallengeCreated; // 챌린지 생성 여부 필드 추가

        @JsonProperty("isAnonymous")
        private boolean isAnonymous;

        private List<OptionResponse> options;

        public static DetailResponse fromEntity(Vote vote, boolean isChallengeCreated) {
            return DetailResponse.builder()
                    .voteNo(vote.getVoteNo())
                    .voteTitle(vote.getVoteTitle())
                    .voteType(vote.getVoteType().name())
                    .voteEndDate(vote.getVoteEndDate())
                    .totalVotes(vote.getTotalVotes())
                    .points(vote.getPoints())
                    .isAnonymous(vote.isAnonymous())
                    .isChallengeCreated(isChallengeCreated) // 필드 매핑
                    .options(vote.getVoteContents().stream()
                            .map(OptionResponse::fromEntity)
                            .collect(Collectors.toList()))
                    .build();
        }
    }

    /**
     * 투표 항목 정보를 담는 공통 응답 DTO
     */
    @Getter
    @Builder
    public static class OptionResponse {
        private Long voteContentNo;
        private String voteContent;
        private int voteCount;

        public static OptionResponse fromEntity(VoteContent voteContent) {
            return OptionResponse.builder()
                    .voteContentNo(voteContent.getVoteContentNo())
                    .voteContent(voteContent.getVoteContent())
                    .voteCount(voteContent.getVoteCount())
                    .build();
        }
    }
}