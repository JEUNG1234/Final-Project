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

    /**
     * 투표자 정보 응답 DTO
     */
    @Getter
    @Builder
    public static class VoterResponse {
        private String userId;   // 사용자 ID
        private String userName; // 사용자 이름

        public static VoterResponse fromEntity(User user) {
            return VoterResponse.builder()
                    .userId(user.getUserId())
                    .userName(user.getUserName())
                    .build();
        }
    }

    /**
     * 투표 생성을 위한 요청 DTO
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String voteTitle;      // 투표 제목
        private String voteType;       // 투표 유형 (단기/장기)
        private LocalDate voteEndDate; // 투표 종료일
        private List<String> options;  // 투표 항목 목록
        private String userId;         // 작성자 ID
        private boolean anonymous;     // 익명 여부
        private Integer points;        // 관련 포인트

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
        private Long voteNo;            // 투표 번호
        private String voteTitle;       // 투표 제목
        private String voteType;        // 투표 유형
        private LocalDate voteEndDate;  // 투표 종료일
        private int totalVotes;         // 총 투표 수
        private Integer points;         // 관련 포인트
        private Long votedOptionNo;     // 사용자가 투표한 항목 ID, 없으면 null

        @JsonProperty("isAnonymous")
        private boolean isAnonymous;    // 익명 여부
        private List<OptionResponse> options; // 투표 항목 목록

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
        private Long voteNo;                // 투표 번호
        private String voteTitle;           // 투표 제목
        private String voteType;            // 투표 유형
        private LocalDate voteEndDate;      // 투표 종료일
        private int totalVotes;             // 총 투표 수
        private Integer points;             // 관련 포인트
        private boolean isChallengeCreated; // 챌린지 생성 여부

        @JsonProperty("isAnonymous")
        private boolean isAnonymous;        // 익명 여부
        private List<OptionResponse> options; // 투표 항목 목록

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
        private Long voteContentNo;   // 투표 항목 번호
        private String voteContent;   // 투표 항목 내용
        private int voteCount;        // 해당 항목의 투표 수

        public static OptionResponse fromEntity(VoteContent voteContent) {
            return OptionResponse.builder()
                    .voteContentNo(voteContent.getVoteContentNo())
                    .voteContent(voteContent.getVoteContent())
                    .voteCount(voteContent.getVoteCount())
                    .build();
        }
    }
}